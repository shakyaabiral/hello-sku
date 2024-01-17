import { CarrierCode, CarrierQuote, Order } from '../../entities';
import { Carrier, SalesOrder } from '../../../../../api-tests/util';
import { CarrierFeesMap } from './carrierFeesMap';

export type Success = {
  outcome: 'SUCCESS';
  order: Order;
};

type OrderAlreadyBooked = {
  outcome: 'ORDER_ALREADY_BOOKED';
};

type OrderNotFound = {
  outcome: 'ORDER_NOT_FOUND';
};

type OrderHasNoLineItems = {
  outcome: 'ORDER_HAS_NO_LINE_ITEMS';
};

type NoMatchingCarrier = {
  outcome: 'NO_MATCHING_CARRIER';
};
export type GenerateOrderQuotesResult =
  | Success
  | OrderNotFound
  | OrderAlreadyBooked
  | OrderHasNoLineItems
  | NoMatchingCarrier;
export const deriveGenerateOrderQuotesOutcome = (
  order: Order | undefined,
  carriers: CarrierCode[],
  carrierFeesMap: CarrierFeesMap
): GenerateOrderQuotesResult => {
  if (!order) {
    return {
      outcome: 'ORDER_NOT_FOUND',
    };
  }
  if (order.status === 'BOOKED') {
    return {
      outcome: 'ORDER_ALREADY_BOOKED',
    };
  }

  if (order.items.length === 0) {
    return {
      outcome: 'ORDER_HAS_NO_LINE_ITEMS',
    };
  }

  const quotes = carriers.map((carrier) =>
    generateQuoteForCarrier(order, carrier, carrierFeesMap)
  );

  return {
    outcome: 'SUCCESS',
    order: {
      ...order,
      quotes,
      status: 'QUOTED',
    },
  };
};

const calculateCarrierFees = (
  carrier: Carrier,
  items: SalesOrder['items'],
  carrierFeesMap: CarrierFeesMap
): number => {
  const carrierFeeConfig = carrierFeesMap[carrier];
  return items.reduce(
    (acc, item) => acc + item.gramsPerItem * carrierFeeConfig.pricePerGram,
    carrierFeeConfig.basePrice
  );
};

export const generateQuoteForCarrier = (
  order: Order,
  carrier: CarrierCode,
  carrierFeesMap: CarrierFeesMap
): CarrierQuote => ({
  carrier,
  priceCents: calculateCarrierFees(carrier, order.items, carrierFeesMap),
});
