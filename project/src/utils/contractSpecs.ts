import { ContractSpecs } from '../types/trade';

// Real futures contract specifications
export const CONTRACT_SPECS: Record<string, ContractSpecs> = {
  // E-mini S&P 500
  'ES': {
    symbol: 'ES',
    tickSize: 0.25,
    tickValue: 12.50,
    pointValue: 50,
    currency: 'USD'
  },
  // E-mini NASDAQ-100
  'NQ': {
    symbol: 'NQ',
    tickSize: 0.25,
    tickValue: 5.00,
    pointValue: 20,
    currency: 'USD'
  },
  // E-mini Dow Jones
  'YM': {
    symbol: 'YM',
    tickSize: 1.0,
    tickValue: 5.00,
    pointValue: 5,
    currency: 'USD'
  },
  // E-mini Russell 2000
  'RTY': {
    symbol: 'RTY',
    tickSize: 0.10,
    tickValue: 5.00,
    pointValue: 50,
    currency: 'USD'
  },
  // Crude Oil
  'CL': {
    symbol: 'CL',
    tickSize: 0.01,
    tickValue: 10.00,
    pointValue: 1000,
    currency: 'USD'
  },
  // Natural Gas
  'NG': {
    symbol: 'NG',
    tickSize: 0.001,
    tickValue: 10.00,
    pointValue: 10000,
    currency: 'USD'
  },
  // Gold
  'GC': {
    symbol: 'GC',
    tickSize: 0.10,
    tickValue: 10.00,
    pointValue: 100,
    currency: 'USD'
  },
  // Silver
  'SI': {
    symbol: 'SI',
    tickSize: 0.005,
    tickValue: 25.00,
    pointValue: 5000,
    currency: 'USD'
  },
  // Euro FX
  'EUR': {
    symbol: 'EUR',
    tickSize: 0.00005,
    tickValue: 6.25,
    pointValue: 125000,
    currency: 'USD'
  },
  // British Pound
  'GBP': {
    symbol: 'GBP',
    tickSize: 0.0001,
    tickValue: 6.25,
    pointValue: 62500,
    currency: 'USD'
  },
  // Japanese Yen
  'JPY': {
    symbol: 'JPY',
    tickSize: 0.0000005,
    tickValue: 6.25,
    pointValue: 12500000,
    currency: 'USD'
  },
  // 10-Year Treasury Note
  'ZN': {
    symbol: 'ZN',
    tickSize: 0.015625,
    tickValue: 15.625,
    pointValue: 1000,
    currency: 'USD'
  },
  // 30-Year Treasury Bond
  'ZB': {
    symbol: 'ZB',
    tickSize: 0.03125,
    tickValue: 31.25,
    pointValue: 1000,
    currency: 'USD'
  }
};

export function calculatePnL(
  symbol: string,
  side: 'long' | 'short',
  quantity: number,
  entryPrice: number,
  exitPrice: number
): number {
  const specs = CONTRACT_SPECS[symbol.toUpperCase()];
  
  if (!specs) {
    // Fallback calculation for unknown symbols
    const priceDiff = side === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
    return priceDiff * quantity;
  }

  const priceDiff = side === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
  return priceDiff * specs.pointValue * quantity;
}

export function getContractInfo(symbol: string): ContractSpecs | null {
  return CONTRACT_SPECS[symbol.toUpperCase()] || null;
}

export function formatPrice(symbol: string, price: number): string {
  const specs = CONTRACT_SPECS[symbol.toUpperCase()];
  if (!specs) return price.toFixed(2);
  
  // Determine decimal places based on tick size
  const decimalPlaces = specs.tickSize.toString().split('.')[1]?.length || 0;
  return price.toFixed(decimalPlaces);
}