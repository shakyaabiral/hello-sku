import { withAsyncErrorHandling } from './withAsyncErrorHandling'
import { carrierCodeSchema } from '../domain/entities'
import { z } from 'zod-http-schemas'
import { generateQuote } from '../domain/operations/generateQuote'
import { GenerateQuoteResult } from '../domain/operations/generateQuote/generateQuote.deriver'

const carrierQuoteRequestSchema = z.object({
  carriers: carrierCodeSchema.array(),
})

const urlParamsSchema = z.object({
  id: z.string().nonempty(),
})

export const handlePostOrderQuotes = withAsyncErrorHandling(
  async (req, res) => {
    const paresResult = carrierQuoteRequestSchema.safeParse(req.body)
    if (!paresResult.success) {
      res.status(400).json({
        error: 'INVALID_REQUEST_PAYLOAD',
        validationError: paresResult.error,
      })
      return
    }

    const urlParamsParseResult = urlParamsSchema.safeParse(req.params)
    if (!urlParamsParseResult.success) {
      res.status(400).json({
        error: 'INVALID_URL_PARAMETER',
        validationError: urlParamsParseResult.error,
      })
      return
    }

    const orderId = urlParamsParseResult.data.id
    const { carriers } = paresResult.data

    const result = await generateQuote(orderId, carriers)

    const outcomeStatusCodeMap: Record<GenerateQuoteResult['outcome'], number> = {
      SUCCESS: 200,
      ORDER_ALREADY_BOOKED: 200,
      ORDER_NOT_FOUND: 400,
      ORDER_HAS_NO_LINE_ITEMS: 400,
    }

    res.status(outcomeStatusCodeMap[result.outcome]).json(result)
  }
)
