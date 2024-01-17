import { CarrierCode } from '../../entities';

export type CarrierFee = {
  pricePerGram: number;
  basePrice: number;
};

export type CarrierFeesMap = Record<CarrierCode, CarrierFee>;

export const carrierFeesMap: CarrierFeesMap = {
  UPS: {
    basePrice: 800,
    pricePerGram: 0.05,
  },
  USPS: {
    basePrice: 1050,
    pricePerGram: 0.02,
  },
  FEDEX: {
    basePrice: 1000,
    pricePerGram: 0.03,
  },
};
