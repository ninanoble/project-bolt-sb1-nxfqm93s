import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTrades } from '../hooks/useTrades';
import { TradeForm } from './TradeForm';
import { TradeLog } from './TradeLog';
import { TradeDetailModal } from './TradeDetailModal';
import { EquityCurve } from './EquityCurve';
import { DateNavigation } from './DateNavigation';
import { PnLCalendar } from './PnLCalendar';
import { 
  Wallet, 
  LineChart, 
  Target, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Zap, 
  Clock, 
  BarChart, 
  PieChart, 
  Activity, 
  TrendingDown, 
  Percent, 
  ArrowRightLeft, 
  Sun, 
  Moon, 
  LogOut, 
  Eye, 
  Plus, 
  Shield, 
  ArrowLeft, 
  ArrowRight, 
  Edit, 
  Trash,
  FileText,
  TrendingUp
} from 'lucide-react';
import { ViewMode, Trade } from '../types/trade';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, subDays } from 'date-fns';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line, Area, Bar, Cell, AreaChart as RechartsAreaChart, BarChart as RechartsBarChart } from 'recharts';

interface ChartDataPoint {
  date: string;
  value: number;
  cumulativeValue: number;
}

export function JournalDashboard() {
  const { isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const {
    trades,
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    addTrade,
    updateTrade,
    deleteTrade
  } = useTrades();

  const [showTradeForm, setShowTradeForm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showTradeDetail, setShowTradeDetail] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate trading day metrics
  const tradingDayMetrics = useMemo(() => {
    const winningDays = trades.filter(t => t.pnl !== undefined && t.pnl > 0).length;
    const losingDays = trades.filter(t => t.pnl !== undefined && t.pnl < 0).length;
    const totalTradingDays = trades.length;
    const winRate = trades.length > 0 ? (winningDays / totalTradingDays * 100).toFixed(1) : '0.0';

    return {
      winningDays,
      losingDays,
      totalTradingDays,
      winRate
    };
  }, [trades]);

  // Calculate additional metrics
  const metrics = useMemo(() => {
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winningTrades = trades.filter(trade => trade.pnl && trade.pnl > 0);
    const losingTrades = trades.filter(trade => trade.pnl && trade.pnl < 0);
    
    // Calculate average win/loss
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length 
      : 0;
    
    const avgLoss = losingTrades.length > 0 
      ? losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length 
      : 0;

    // Calculate Risk-to-Reward Ratio
    const riskRewardRatio = Math.abs(avgLoss) > 0 ? Math.abs(avgWin / Math.abs(avgLoss)) : 0;

    // Calculate Profit Factor
    const profitFactor = Math.abs(avgLoss) > 0 ? Math.abs(avgWin / avgLoss) : 0;

    // Calculate Maximum Drawdown
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativePnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    
    sortedTrades.forEach(trade => {
      cumulativePnL += trade.pnl || 0;
      peak = Math.max(peak, cumulativePnL);
      const currentDrawdown = (cumulativePnL - peak) / peak;
      maxDrawdown = Math.min(maxDrawdown, currentDrawdown);
    });

    // Calculate Trade Frequency
    const totalDays = Math.max(1, (new Date().getTime() - new Date(sortedTrades[0]?.date || new Date()).getTime()) / (1000 * 60 * 60 * 24));
    const tradeFrequency = trades.length / totalDays;

    // Calculate Expectancy
    const expectancy = trades.length > 0 ? (winningTrades.length * avgWin + losingTrades.length * avgLoss) / trades.length : 0;

    return {
      totalPnL,
      avgWin,
      avgLoss,
      riskRewardRatio,
      profitFactor,
      maxDrawdown,
      tradeFrequency,
      expectancy,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  }, [trades]);

  // Calculate equity curve data with account balance
  const equityData = useMemo(() => {
    if (!trades.length) return [];

    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const data: ChartDataPoint[] = [];
    let runningEquity = accountBalance;

    // Add initial point
    data.push({
      date: format(new Date(sortedTrades[0].date), 'MMM d'),
      value: 0,
      cumulativeValue: 0
    });

    // Add points for each trade
    sortedTrades.forEach(trade => {
      if (trade.pnl !== undefined) {
        runningEquity += trade.pnl;
        data.push({
          date: format(new Date(trade.date), 'MMM d'),
          value: trade.pnl,
          cumulativeValue: runningEquity - accountBalance
        });
      }
    });

    return data;
  }, [trades, accountBalance]);

  const handleLogout = () => {
    logout();
  };

  const handleAddTrade = async (tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addTrade(tradeData);
    setShowTradeForm(false);
    setIsAddingTrade(false);
    
    // Set the selected date to the new trade's date
    setSelectedDate(new Date(tradeData.date));
    
    // Force a re-render of the calendar and metrics
    setCurrentMonth(new Date(tradeData.date));
  };

  const handleUpdateTrade = async (tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTrade) {
      await updateTrade(selectedTrade, tradeData);
      setSelectedTrade(null);
      setShowTradeForm(false);
    }
  };

  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade.id);
    setShowTradeForm(true);
  };

  const handleViewTrade = (trade: Trade) => {
    setShowTradeDetail(trade.id);
  };

  const dailyTrades = useMemo(() => {
    return trades.filter(trade => isSameDay(new Date(trade.date), selectedDate));
  }, [trades, selectedDate]);

  const totalPnL = useMemo(() => {
    return trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  }, [trades]);

  const profitFactor = trades.length > 0 ? Math.abs(
    trades.filter(trade => trade.pnl > 0).reduce((sum, trade) => sum + (trade.pnl || 0), 0) /
    trades.filter(trade => trade.pnl < 0).reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  ) : 0;

  const avgWinningTrade = useMemo(() => {
    const winningTrades = trades.filter(trade => trade.pnl && trade.pnl > 0);
    return winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length : 0;
  }, [trades]);

  const avgLosingTrade = useMemo(() => {
    const losingTrades = trades.filter(trade => trade.pnl && trade.pnl < 0);
    return losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length : 0;
  }, [trades]);

  // Calculate winning percentages
  const winningPercentages = useMemo(() => {
    const winningTrades = trades.filter(trade => trade.pnl && trade.pnl > 0).length;
    const totalTrades = trades.length;
    const winRateByTrades = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) : '0.0';

    // Calculate winning days
    const uniqueDays = new Set(trades.map(trade => format(new Date(trade.date), 'yyyy-MM-dd')));
    const winningDays = Array.from(uniqueDays).filter(day => {
      const dayTrades = trades.filter(trade => format(new Date(trade.date), 'yyyy-MM-dd') === day);
      return dayTrades.some(trade => trade.pnl && trade.pnl > 0);
    }).length;
    const winRateByDays = uniqueDays.size > 0 ? (winningDays / uniqueDays.size * 100).toFixed(1) : '0.0';

    return {
      byTrades: winRateByTrades,
      byDays: winRateByDays
    };
  }, [trades]);

  // Calculate streaks
  const calculateStreaks = useMemo(() => {
    let currentDayStreak = 0;
    let currentTradeStreak = 0;
    let lastDayWin: boolean | null = null;
    let lastTradeWin: boolean | null = null;

    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Day Streak
    const dailyPnLMap = new Map<string, number>();
    sortedTrades.forEach(trade => {
      const date = format(new Date(trade.date), 'yyyy-MM-dd');
      dailyPnLMap.set(date, (dailyPnLMap.get(date) || 0) + (trade.pnl || 0));
    });

    const sortedDays = Array.from(dailyPnLMap.keys()).sort();

    // Calculate day streak based on daily PnL
    if (sortedDays.length > 0) {
      let i = sortedDays.length - 1;
      while (i >= 0) {
        const day = sortedDays[i];
        const pnl = dailyPnLMap.get(day) || 0;
        const isWin = pnl > 0;

        if (lastDayWin === null) {
          lastDayWin = isWin;
          currentDayStreak = 1;
        } else if (isWin === lastDayWin) {
          currentDayStreak++;
        } else {
          break; // Streak broken
        }
        i--;
      }
    }

    // Trade Streak
    if (sortedTrades.length > 0) {
      let i = sortedTrades.length - 1;
      while (i >= 0) {
        const trade = sortedTrades[i];
        const isWin = (trade.pnl || 0) > 0;

        if (lastTradeWin === null) {
          lastTradeWin = isWin;
          currentTradeStreak = 1;
        } else if (isWin === lastTradeWin) {
          currentTradeStreak++;
        } else {
          break; // Streak broken
        }
        i--;
      }
    }

    return {
      currentDayStreak,
      currentTradeStreak,
      lastDayWin,
      lastTradeWin
    };
  }, [trades]);

  // Find the trade object for TradeDetailModal
  const selectedTradeForDetail = useMemo(() => {
    return showTradeDetail ? trades.find(t => t.id === showTradeDetail) : undefined;
  }, [showTradeDetail, trades]);

  // Custom tick formatter for UTC dates
  const formatDate = (value: string) => {
    const date = new Date(value);
    return format(date, 'MMM d');
  };

  // Calculate daily PnL data first
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    
    // Create an array of dates from startDate to endDate
    const dateRange = Array.from({ length: 31 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });

    // Create a map of trades by date
    const tradesByDate = new Map<string, Trade[]>();
    trades.forEach(trade => {
      const tradeDate = new Date(trade.date);
      const dateKey = format(tradeDate, 'yyyy-MM-dd');
      if (!tradesByDate.has(dateKey)) {
        tradesByDate.set(dateKey, []);
      }
      tradesByDate.get(dateKey)?.push(trade);
    });

    // Generate chart data
    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const tradesForDay = tradesByDate.get(dateKey) || [];
      const dailyPnL = tradesForDay.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      const cumulativeValue = data.length > 0 ? data[data.length - 1].cumulativeValue + dailyPnL : dailyPnL;
      
      // Store both raw date string and formatted date
      data.push({
        date: dateKey, // Keep raw date string for sorting
        value: dailyPnL,
        cumulativeValue: cumulativeValue
      });
    });
    
    return data;
  }, [trades]);

  // Create daily PnL data with formatted dates
  const dailyPnLData = useMemo(() => {
    return chartData.slice(-7).map(item => ({
      date: format(new Date(item.date), 'MMM d'),
      value: item.value
    }));
  }, [chartData]);

  // Create cumulative PnL data with formatted dates
  const cumulativePnLData = useMemo(() => {
    return chartData.map(item => ({
      date: format(new Date(item.date), 'MMM d'),
      value: item.cumulativeValue
    }));
  }, [chartData]);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-black mb-6">
            {/* Net P&L Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20">
                  <Wallet className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Net P&L</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${metrics.totalPnL.toLocaleString()}
              </span>
            </div>
            </motion.div>

            {/* Trade Expectancy Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20">
                  <LineChart className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Trade Expectancy</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${metrics.expectancy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${metrics.expectancy.toFixed(2)}
                </span>
                <span className="text-xs text-white/60">per trade</span>
              </div>
            </motion.div>

            {/* Profit Factor Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 rounded-lg bg-green-500/20">
                  <PieChart className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Profit Factor</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-green-400">{metrics.profitFactor.toFixed(2)}</span>
                <span className="text-xs text-white/60">ratio</span>
              </div>
            </motion.div>

            {/* Win Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 rounded-lg bg-yellow-500/20">
                  <Percent className="w-4 h-4 text-yellow-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Win Rate</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-yellow-400">{tradingDayMetrics.winRate}%</span>
                <span className="text-xs text-white/60">of trades</span>
              </div>
            </motion.div>

            {/* Avg Win/Loss Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-black border border-[#1a1a1a] hover:border-red-500/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 rounded-lg bg-red-500/20">
                  <ArrowRightLeft className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Avg Win/Loss</h3>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-white/60">Win</span>
                    <span className="text-green-400 font-medium">${metrics.avgWin.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (metrics.avgWin / Math.max(metrics.avgWin, Math.abs(metrics.avgLoss))) * 100)}%` }}
                      className="h-full bg-green-500/50"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-white/60">Loss</span>
                    <span className="text-red-400 font-medium">${Math.abs(metrics.avgLoss).toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (Math.abs(metrics.avgLoss) / Math.max(metrics.avgWin, Math.abs(metrics.avgLoss))) * 100)}%` }}
                      className="h-full bg-red-500/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-black">
            {/* NBS Score Widget - Tradezella Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl bg-black border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">NBS Score</h2>
                <span className="text-xs text-white/60">{format(new Date(), 'MMM d')}</span>
              </div>

              <div className="relative h-[200px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[180px] h-[180px] relative">
                    {/* Triangle Background */}
                    <svg className="absolute inset-0" viewBox="0 0 100 100">
                      <polygon
                        points="50,10 90,90 10,90"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                      {/* Score Area */}
                      <polygon
                        points="50,10 90,90 10,90"
                        fill="rgba(59,130,246,0.1)"
                        stroke="rgba(59,130,246,0.3)"
                        strokeWidth="1"
                        style={{
                          clipPath: `polygon(50% 10%, ${50 + 40 * Math.cos((tradingDayMetrics.winRate * 1.8 - 90) * Math.PI / 180)}% ${90 - 40 * Math.sin((tradingDayMetrics.winRate * 1.8 - 90) * Math.PI / 180)}%, ${50 + 40 * Math.cos((metrics.riskRewardRatio * 2 - 90) * Math.PI / 180)}% ${90 - 40 * Math.sin((metrics.riskRewardRatio * 2 - 90) * Math.PI / 180)}%, ${50 + 40 * Math.cos((metrics.profitFactor * 45 - 90) * Math.PI / 180)}% ${90 - 40 * Math.sin((metrics.profitFactor * 45 - 90) * Math.PI / 180)}%, ${50 + 40 * Math.cos((metrics.maxDrawdown * -100 - 90) * Math.PI / 180)}% ${90 - 40 * Math.sin((metrics.maxDrawdown * -100 - 90) * Math.PI / 180)}%, ${50 + 40 * Math.cos((metrics.tradeFrequency * 50 - 90) * Math.PI / 180)}% ${90 - 40 * Math.sin((metrics.tradeFrequency * 50 - 90) * Math.PI / 180)}%)`
                        }}
                      />
                    </svg>

                    {/* Center Score */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">
                          {Math.min(Math.max(
                            Math.round(
                              (tradingDayMetrics.winRate || 0) * 0.3 +
                              (Math.min(metrics.riskRewardRatio, 5) / 5 * 100) * 0.2 +
                              (Math.min(metrics.profitFactor, 5) / 5 * 100) * 0.2 +
                              ((1 - Math.min(Math.abs(metrics.maxDrawdown), 1)) * 100) * 0.2 +
                              (metrics.tradeFrequency * 100) * 0.1
                            ),
                            0
                          ),
                          100)}
                        </div>
                        <div className="text-xs text-white/60">NBS Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#1a1a1a]">
                  <div className="text-sm font-medium text-blue-400">{tradingDayMetrics.winRate}%</div>
                  <div className="text-xs text-white/60">Win Rate</div>
                </div>
                <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#1a1a1a]">
                  <div className="text-sm font-medium text-green-400">{metrics.profitFactor.toFixed(2)}</div>
                  <div className="text-xs text-white/60">Profit Factor</div>
                </div>
                <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#1a1a1a]">
                  <div className="text-sm font-medium text-purple-400">
                    {(metrics.avgWin / Math.max(metrics.avgWin, Math.abs(metrics.avgLoss))).toFixed(2)}
                  </div>
                  <div className="text-xs text-white/60">W/L Ratio</div>
                </div>
              </div>
            </motion.div>

            {/* Cumulative P&L Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-xl bg-black border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Cumulative P&L</h2>
                <span className="text-xs text-white/60">30 Days</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsAreaChart data={cumulativePnLData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorPnL)" 
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Daily P&L Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 rounded-xl bg-black border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Daily P&L</h2>
                <span className="text-xs text-white/60">Last 7 Days</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dailyPnLData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="value"
                      fill="#10B981"
                      fillOpacity={1}
                    >
                      {dailyPnLData.map((entry: ChartDataPoint, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10B981' : '#EF4444'} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            </div>

          {/* PnL Calendar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6 max-w-6xl mx-auto"
          >
            <PnLCalendar 
              trades={trades}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setShowTradeDetail(null);
              }}
              selectedDate={selectedDate}
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black">
            {/* Trade Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-xl bg-[#000000] border border-[#1a1a1a] hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Recent Trades</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white/60">Last 5 trades</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="space-y-4">
                {trades.slice(0, 5).map((trade) => (
                  <motion.div
                    key={trade.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-[#1a1a1a] border border-[#1a1a1a] hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          trade.side === 'long' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side === 'long' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{trade.symbol}</h3>
                          <p className="text-sm text-white/60">{format(new Date(trade.date), 'MMM d, yyyy h:mm a')}</p>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-black">
                        <span className={`font-medium ${
                          trade.pnl && trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.pnl && trade.pnl >= 0 ? '+' : ''}{trade.pnl?.toLocaleString()}
                        </span>
                        {trade.strategy && (
                          <span className="text-xs text-white/50 mt-1">{trade.strategy}</span>
                        )}
                      </div>
                    </div>
                    {trade.notes && (
                      <p className="text-sm text-white/70 mt-2 line-clamp-2">{trade.notes}</p>
                    )}
                    <div className="flex justify-end space-x-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewTrade(trade)}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditTrade(trade)}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteTrade(trade.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

        {/* Add Trade Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowTradeForm(true);
              setIsAddingTrade(true);
            }}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </motion.button>

      {/* Modals */}
        <AnimatePresence>
          {showTradeForm && (
            <TradeForm
              onClose={() => {
                setShowTradeForm(false);
                setIsAddingTrade(false);
                setSelectedTrade(null);
              }}
              onSubmit={isAddingTrade ? handleAddTrade : handleUpdateTrade}
              trade={selectedTrade ? trades.find(t => t.id === selectedTrade) : undefined}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTradeDetail && (
            <TradeDetailModal
              trade={trades.find(t => t.id === showTradeDetail)!}
              onClose={() => setShowTradeDetail(null)}
              onEdit={handleEditTrade}
            />
          )}
        </AnimatePresence>
    </div>
  );
}