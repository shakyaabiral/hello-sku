import { deriveGenerateQuoteOutcome, GenerateQuoteResult } from './generateQuote.deriver'
import { ordersRepo } from '../../../repos/ordersRepo'
import { CarrierCode, Order } from '../../entities'

export const generateQuote = async (orderId: Order['id'], carriers: CarrierCode[]): Promise<GenerateQuoteResult> => {
    const order = await ordersRepo.getOrder(orderId);
    const result = deriveGenerateQuoteOutcome(order, carriers)
    return result
}
