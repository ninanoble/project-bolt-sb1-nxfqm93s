export type ViewMode = 'dashboard' | 'reports' | 'tradelog' | 'notebook' | 'playbook' | 'dailyjournal';

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  side: 'long' | 'short';
  status: 'open' | 'closed';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  commission: number;
  strategy?: string;
  notes?: string;
  tags?: string[];
  stopLoss?: number;
  takeProfit?: number;
  timeframe?: string;
  // Journaling fields
  preTradingRoutine?: string;
  newsAndNotes?: string;
  dailyRecap?: string;
  postSessionReview?: string;
  tradesTakenToday?: string;
  markupsFromTradingDay?: string[];
  endOfDayEvaluation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeSummary {
  period: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  grossProfit: number;
  grossLoss: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  totalCommission: number;
  netPnL: number;
}

export interface ContractSpecs {
  symbol: string;
  tickSize: number;
  tickValue: number;
  pointValue: number;
  currency: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}