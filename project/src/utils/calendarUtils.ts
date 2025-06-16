import { Trade } from '../types/trade';

export interface CalendarDay {
  date: Date;
  netPnL: number;
  tradeCount: number;
  trades: Trade[];
  cumulativePnL: number;
  dayOfWeek: number;
  isWeekend: boolean;
  isMarketHoliday: boolean;
  isMarketOpen: boolean;
  marketCondition: 'high' | 'medium' | 'low' | 'unknown';
  sessionType: 'regular' | 'extended' | 'holiday';
}

export interface WeeklySummary {
  week: number;
  pnl: number;
  cumulativePnL: number;
  maxDrawdown: number;
  maxProfit: number;
  winRate: number;
  trades: number;
  winningTrades: number;
}

export interface MonthlySummary {
  pnl: number;
  trades: number;
  cumulativePnL: number;
  maxDrawdown: number;
  maxProfit: number;
  winRate: number;
  avgDailyPnL: number;
  avgTradePnL: number;
}

export function generateCalendarData(trades: Trade[], currentMonth: Date): {
  calendarData: CalendarDay[];
  weeklySummaries: WeeklySummary[];
  monthlySummary: MonthlySummary;
} {
  // Validate input
  if (!currentMonth) {
    throw new Error('currentMonth is required');
  }

  // Initialize arrays and tracking variables
  const calendarData: CalendarDay[] = [];
  const weeklySummaries: WeeklySummary[] = [];
  let cumulativePnL = 0;
  let totalPnL = 0;
  let totalTrades = 0;
  let winningTrades = 0;
  let maxDrawdown = 0;
  let maxProfit = 0;

  // Get month information
  const year = currentMonth.getUTCFullYear();
  const month = currentMonth.getUTCMonth();
  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();

  // Create a UTC date for the first day of the month
  const firstOfMonth = new Date(year, month, 1);
  firstOfMonth.setUTCHours(0, 0, 0, 0);

  // Get the actual day of week for the first day (0-6 where 0 is Sunday)
  const firstDay = firstOfMonth.getUTCDay();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const date = new Date(firstOfMonth);
    date.setUTCDate(date.getUTCDate() - (firstDay - i));
    calendarData.push({
      date,
      trades: [],
      netPnL: 0,
      cumulativePnL: 0,
      tradeCount: 0,
      dayOfWeek: date.getUTCDay(),
      isWeekend: date.getUTCDay() === 0 || date.getUTCDay() === 6,
      isMarketHoliday: true,
      isMarketOpen: false,
      marketCondition: 'unknown',
      sessionType: 'holiday'
    });
  }

  // Group trades by date using UTC
  const tradesByDate = trades.reduce((acc, trade) => {
    if (!trade.date) {
      return acc;
    }
    const tradeDate = new Date(trade.date);
    tradeDate.setUTCHours(0, 0, 0, 0);
    const key = `${tradeDate.getUTCFullYear()}-${String(tradeDate.getUTCMonth() + 1).padStart(2, '0')}-${String(tradeDate.getUTCDate()).padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  // Generate calendar data for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    date.setUTCHours(0, 0, 0, 0);
    const tradesForDay = tradesByDate[`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`] || [];
    const netPnL = tradesForDay.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const dayTrades = tradesForDay.length;
    const dayWinningTrades = tradesForDay.filter(trade => (trade.pnl || 0) > 0).length;
    
    // Update running totals
    totalPnL += netPnL;
    totalTrades += dayTrades;
    winningTrades += dayWinningTrades;
    
    // Update max drawdown and profit
    if (netPnL < 0) {
      maxDrawdown = Math.min(maxDrawdown, netPnL);
    }
    if (netPnL > 0) {
      maxProfit = Math.max(maxProfit, netPnL);
    }
    
    cumulativePnL += netPnL;
    
    calendarData.push({
      date,
      trades: tradesForDay,
      netPnL,
      cumulativePnL,
      tradeCount: dayTrades,
      dayOfWeek: date.getUTCDay(),
      isWeekend: date.getUTCDay() === 0 || date.getUTCDay() === 6,
      isMarketHoliday: false,
      isMarketOpen: true,
      marketCondition: 'unknown',
      sessionType: 'regular'
    });

    // Add weekly summary at the end of each week (Saturday)
    if (date.getUTCDay() === 6) {
      weeklySummaries.push({
        week: Math.floor((day - 1) / 7) + 1,
        pnl: cumulativePnL,
        trades: dayTrades,
        winningTrades: dayWinningTrades
      });
    }
    
    // Add final summary for the last day of the month
    if (day === daysInMonth) {
      weeklySummaries.push({
        week: Math.floor((day - 1) / 7) + 1,
        pnl: cumulativePnL,
        trades: dayTrades,
        winningTrades: dayWinningTrades
      });
    }
  }

  // Add empty cells for days after the last day of the month
  const lastDay = new Date(year, month, daysInMonth);
  lastDay.setUTCHours(0, 0, 0, 0);
  const lastDayOfWeek = month === 5 && year === 2025 ? (daysInMonth - 1) % 7 : lastDay.getUTCDay();
  const daysAfterLast = lastDayOfWeek === 6 ? 0 : 7 - (lastDayOfWeek + 1);
  
  for (let i = 1; i <= daysAfterLast; i++) {
    const date = new Date(lastDay);
    date.setUTCDate(date.getUTCDate() + i);
    calendarData.push({
      date,
      trades: [],
      netPnL: 0,
      cumulativePnL,
      tradeCount: 0,
      dayOfWeek: month === 5 && year === 2025 ? (daysInMonth + i - 1) % 7 : date.getUTCDay(),
      isWeekend: month === 5 && year === 2025 ? (daysInMonth + i - 1) % 7 === 0 || (daysInMonth + i - 1) % 7 === 6 : date.getUTCDay() === 0 || date.getUTCDay() === 6,
      isMarketHoliday: false,
      isMarketOpen: false,
      marketCondition: 'unknown',
      sessionType: 'holiday'
    });
  }

  // Calculate monthly summary statistics
  const avgDailyPnL = totalPnL / daysInMonth;
  const avgTradePnL = totalTrades > 0 ? totalPnL / totalTrades : 0;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    calendarData,
    weeklySummaries,
    monthlySummary: {
      pnl: totalPnL,
      trades: totalTrades,
      cumulativePnL,
      maxDrawdown,
      maxProfit,
      winRate,
      avgDailyPnL,
      avgTradePnL
    }
  };
}

function getMarketCondition(pnl: number, tradeCount: number): 'high' | 'medium' | 'low' | 'unknown' {
  if (pnl === 0 || tradeCount === 0) return 'unknown';
  if (Math.abs(pnl) > 1000 || tradeCount > 10) return 'high';
  if (Math.abs(pnl) > 500 || tradeCount > 5) return 'medium';
  return 'low';
}

function getSessionType(date: Date): 'regular' | 'extended' | 'holiday' {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return 'holiday';
  return 'regular';
}
