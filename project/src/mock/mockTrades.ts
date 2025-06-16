import { Trade } from '../types/trade';

export const generateMockTrades = (startDate: Date, endDate: Date): Trade[] => {
  const trades: Trade[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    // Skip weekends
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      // Generate 0-5 trades per day
      const tradesPerDay = Math.floor(Math.random() * 6);
      
      for (let i = 0; i < tradesPerDay; i++) {
        const trade: Trade = {
          id: `trade-${trades.length + 1}`,
          date: current.toISOString(),
          symbol: getMockSymbol(),
          entryPrice: getMockPrice(),
          exitPrice: getMockPrice(),
          quantity: getMockQuantity(),
          pnl: getMockPnL(),
          entryTime: getMockTime(),
          exitTime: getMockTime(),
          strategy: getMockStrategy(),
          notes: getMockNotes(),
          tags: getMockTags()
        };
        trades.push(trade);
      }
    }
    current.setDate(current.getDate() + 1);
  }
  
  return trades;
};

const symbols = ['ES', 'NQ', 'RTY', 'YM'];
const strategies = ['Breakout', 'Trend', 'Reversal', 'Range'];
const tags = ['Morning', 'Afternoon', 'News', 'Volatility'];

const getMockSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];
const getMockStrategy = () => strategies[Math.floor(Math.random() * strategies.length)];
const getMockTags = () => {
  const count = Math.floor(Math.random() * 3);
  return Array(count)
    .fill(0)
    .map(() => tags[Math.floor(Math.random() * tags.length)]);
};

const getMockPrice = () => Math.random() * (4000 - 3000) + 3000; // Random price between 3000-4000
const getMockQuantity = () => Math.floor(Math.random() * 5) + 1; // Random quantity 1-5

const getMockPnL = () => {
  const isProfit = Math.random() > 0.5;
  const amount = Math.random() * 2000 + 500; // Random PnL between 500-2500
  return isProfit ? amount : -amount;
};

const getMockTime = () => {
  const hours = Math.floor(Math.random() * 17) + 9; // Random hour between 9-26 (9am-2am)
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getMockNotes = () => {
  const notes = [
    'Strong breakout confirmed',
    'Failed breakout attempt',
    'News impact',
    'Volatility spike',
    'Technical reversal',
    'Range breakout',
    'Trend continuation'
  ];
  return notes[Math.floor(Math.random() * notes.length)];
};
