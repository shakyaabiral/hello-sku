import { CarrierCode, CarrierQuote, Order, OrderItem } from '../../entities';

type Success = {
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
export type GenerateQuoteResult =
  | Success
  | OrderNotFound
  | OrderAlreadyBooked
  | OrderHasNoLineItems;
export const deriveGenerateQuoteOutcome = (
  order: Order | undefined,
  carriers: CarrierCode[]
): GenerateQuoteResult => {
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

  const quotes = carriers.map((carrier) => generateQuote(order, carrier));

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
  carrier: CarrierCode,
  items: OrderItem[]
): number => {
  switch (carrier) {
    case 'UPS':
      return items.reduce(
        (acc, item) => acc + item.gramsPerItem * item.quantity * 0.05,
        800
      );
    case 'USPS':
      return items.reduce(
        (acc, item) => acc + item.gramsPerItem * item.quantity * 0.02,
        1050
      );
    case 'FEDEX':
      return items.reduce(
        (acc, item) => acc + item.gramsPerItem * item.quantity * 0.03,
        1000
      );
    default:
      throw new Error(`Unknown carrier: ${carrier}`);
  }
};

const generateQuote = (order: Order, carrier: CarrierCode): CarrierQuote => ({
  carrier,
  priceCents: calculateCarrierFees(carrier, order.items),
});
