import { expect } from 'chai';
import { Order } from '../../entities';
import { deriveGenerateOrderQuotesOutcome } from './generateOrderQuotes.deriver';
import { carrierFeesMap } from './carrierFeesMap';

describe('generateOrderQuotes.deriver', () => {
  let mockOrder: Order;

  beforeEach(() => {
    mockOrder = {
      id: '123',
      customer: 'Sally Bob',
      items: [
        {
          sku: 'SHOE-RED-1',
          quantity: 1,
          gramsPerItem: 100,
          price: 20,
        },
      ],
      quotes: [],
      status: 'RECEIVED',
    };
  });

  it('returns ORDER NOT FOUND when passed an undefined order', () => {
    const result = deriveGenerateOrderQuotesOutcome(
      undefined,
      ['UPS'],
      carrierFeesMap
    );
    expect(result.outcome).to.eq('ORDER_NOT_FOUND');
  });

  it('returns ORDER ALREADY BOOKED when passed a booked order', () => {
    const result = deriveGenerateOrderQuotesOutcome(
      {
        ...mockOrder,
        status: 'BOOKED',
      },
      ['UPS'],
      carrierFeesMap
    );
    expect(result.outcome).to.eq('ORDER_ALREADY_BOOKED');
  });

  it('returns ORDER HAS NO LINE ITEMS when the order has empty items array', () => {
    const result = deriveGenerateOrderQuotesOutcome(
      {
        ...mockOrder,
        items: [],
      },
      ['UPS'],
      carrierFeesMap
    );
    expect(result.outcome).to.eq('ORDER_HAS_NO_LINE_ITEMS');
  });

  it('should generate quotes for order', () => {
    const result = deriveGenerateOrderQuotesOutcome(
      {
        ...mockOrder,
      },
      ['UPS', 'FEDEX', 'USPS'],
      carrierFeesMap
    );
    expect(result).to.deep.eq({
      outcome: 'SUCCESS',
      order: {
        ...mockOrder,
        status: 'QUOTED',
        quotes: [
          {
            carrier: 'UPS',
            priceCents: 805,
          },
          {
            carrier: 'FEDEX',
            priceCents: 1003,
          },
          {
            carrier: 'USPS',
            priceCents: 1052,
          },
        ],
      },
    });
  });
});
