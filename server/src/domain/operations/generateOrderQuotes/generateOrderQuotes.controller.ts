import {
  deriveGenerateOrderQuotesOutcome,
  GenerateOrderQuotesResult,
} from './generateOrderQuotes.deriver';
import { ordersRepo } from '../../../repos/ordersRepo';
import { CarrierCode, Order } from '../../entities';
import { carrierFeesMap } from './carrierFeesMap';

export const generateQuotes = async (
  orderId: Order['id'],
  carriers: CarrierCode[]
): Promise<GenerateOrderQuotesResult> => {
  const order = await ordersRepo.getOrder(orderId);

  const result = deriveGenerateOrderQuotesOutcome(
    order,
    carriers,
    carrierFeesMap
  );

  if (result.outcome === 'SUCCESS') {
    await ordersRepo.updateOrder({ ...result.order });
  }
  return result;
};

export { GenerateOrderQuotesResult };
