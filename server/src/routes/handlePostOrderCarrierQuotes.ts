import { withAsyncErrorHandling } from './withAsyncErrorHandling';
import { carrierCodeSchema } from '../domain/entities';
import { z } from 'zod-http-schemas';
import {
  generateQuote,
  GenerateQuoteResult,
} from '../domain/operations/generateQuote';

const carrierQuoteRequestSchema = z.object({
  carriers: carrierCodeSchema.array(),
});

const carrierQuoteUrlParamsSchema = z.object({
  id: z.string().nonempty(),
});

export const handlePostOrderCarrierQuotes = withAsyncErrorHandling(
  async (req, res) => {
    const bodyParseResult = carrierQuoteRequestSchema.safeParse(req.body);
    if (!bodyParseResult.success) {
      res.status(400).json({
        error: 'INVALID_REQUEST_PAYLOAD',
        validationError: bodyParseResult.error,
      });
      return;
    }

    const urlParamsParseResult = carrierQuoteUrlParamsSchema.safeParse(req.params);
    if (!urlParamsParseResult.success) {
      res.status(400).json({
        error: 'INVALID_URL_PARAMETER',
        validationError: urlParamsParseResult.error,
      });
      return;
    }

    const orderId = urlParamsParseResult.data.id;
    const { carriers } = bodyParseResult.data;

    const result = await generateQuote(orderId, carriers);

    const outcomeStatusCodeMap: Record<GenerateQuoteResult['outcome'], number> =
      {
        SUCCESS: 200,
        ORDER_ALREADY_BOOKED: 400,
        ORDER_NOT_FOUND: 404,
        ORDER_HAS_NO_LINE_ITEMS: 400,
      };

    res.status(outcomeStatusCodeMap[result.outcome]).json(result);
  }
);
