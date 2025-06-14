import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, Calendar, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Percent, Target,
  Clock, Calendar as CalendarIcon, Filter, ChevronDown,
  ChevronRight, Settings, Download, FileText, BarChart3,
  LineChart, PieChart, Activity, Timer, Tag, AlertTriangle,
  TrendingDown, ArrowUp, ArrowDown, Maximize2, Minimize2,
  Clock4, CalendarDays, BarChart4, LineChart as LineChartIcon,
  Gauge, AlertCircle, ArrowRightLeft, CalendarRange
} from 'lucide-react';
import { useTrades } from '../hooks/useTrades';
import { format, subDays, subMonths, subYears, startOfMonth, endOfMonth, parseISO, getHours, getDay, isWeekend } from 'date-fns';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line, Area, Bar, AreaChart, BarChart, PieChart as RechartsPieChart, Cell } from 'recharts';

interface FilterSection {
  title: string;
  icon: React.ReactNode;
  items: string[];
  isOpen?: boolean;
}

interface PerformanceMetrics {
  // General Stats
  bestMonth: number;
  worstMonth: number;
  averageMonthlyPnL: number;
  
  // Totals
  totalPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  totalCommissions: number;
  totalFees: number;
  totalSwap: number;
  
  // Volume
  averageDailyVolume: number;
  
  // Trade Performance
  averageWin: number;
  averageLoss: number;
  averageTradePnL: number;
  averageDailyPnL: number;
  averageWinningDayPnL: number;
  averageLosingDayPnL: number;
  
  // Time-based Stats
  averageHoldTime: number;
  averageWinningHoldTime: number;
  averageLosingHoldTime: number;
  averageBreakEvenHoldTime: number;
  totalTradingDays: number;
  winningDays: number;
  losingDays: number;
  breakEvenDays: number;
  loggedDays: number;
  
  // Win/Loss Streaks
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  maxConsecutiveWinningDays: number;
  maxConsecutiveLosingDays: number;
  
  // Risk & Return
  profitFactor: number;
  tradeExpectancy: number;
  largestWin: number;
  largestLoss: number;
  largestProfitableDay: number;
  largestLosingDay: number;
  averagePlannedRMultiple: number;
  averageRealizedRMultiple: number;
}

export function ReportsPage() {
  const { trades, summary } = useTrades();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'pnl' | 'winRate' | 'profitFactor'>('pnl');
  const [expandedSections, setExpandedSections] = useState<string[]>(['performance', 'timeAnalysis', 'riskMetrics']);

  // Filter trades based on date range
  const filteredTrades = useMemo(() => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return trades.filter(trade => parseISO(trade.date) >= subDays(now, 7));
      case 'month':
        return trades.filter(trade => parseISO(trade.date) >= subMonths(now, 1));
      case 'year':
        return trades.filter(trade => parseISO(trade.date) >= subYears(now, 1));
      default:
        return trades;
    }
  }, [trades, dateRange]);

  // Calculate comprehensive metrics
  const performanceMetrics = useMemo(() => {
    const metrics: PerformanceMetrics = {
      // Initialize all metrics
      bestMonth: 0,
      worstMonth: 0,
      averageMonthlyPnL: 0,
      totalPnL: 0,
      totalTrades: trades.length,
      winningTrades: 0,
      losingTrades: 0,
      breakEvenTrades: 0,
      totalCommissions: 0,
      totalFees: 0,
      totalSwap: 0,
      averageDailyVolume: 0,
      averageWin: 0,
      averageLoss: 0,
      averageTradePnL: 0,
      averageDailyPnL: 0,
      averageWinningDayPnL: 0,
      averageLosingDayPnL: 0,
      averageHoldTime: 0,
      averageWinningHoldTime: 0,
      averageLosingHoldTime: 0,
      averageBreakEvenHoldTime: 0,
      totalTradingDays: 0,
      winningDays: 0,
      losingDays: 0,
      breakEvenDays: 0,
      loggedDays: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      maxConsecutiveWinningDays: 0,
      maxConsecutiveLosingDays: 0,
      profitFactor: 0,
      tradeExpectancy: 0,
      largestWin: 0,
      largestLoss: 0,
      largestProfitableDay: 0,
      largestLosingDay: 0,
      averagePlannedRMultiple: 0,
      averageRealizedRMultiple: 0
    };

    // Calculate basic metrics
    trades.forEach(trade => {
      const pnl = trade.pnl || 0;
      metrics.totalPnL += pnl;
      metrics.totalCommissions += trade.commission || 0;
      metrics.totalFees += trade.fees || 0;
      metrics.totalSwap += trade.swap || 0;

      if (pnl > 0) {
        metrics.winningTrades++;
        metrics.averageWin += pnl;
        metrics.largestWin = Math.max(metrics.largestWin, pnl);
      } else if (pnl < 0) {
        metrics.losingTrades++;
        metrics.averageLoss += pnl;
        metrics.largestLoss = Math.min(metrics.largestLoss, pnl);
      } else {
        metrics.breakEvenTrades++;
      }
    });

    // Calculate averages
    if (metrics.winningTrades > 0) {
      metrics.averageWin /= metrics.winningTrades;
    }
    if (metrics.losingTrades > 0) {
      metrics.averageLoss /= metrics.losingTrades;
    }
    metrics.averageTradePnL = metrics.totalPnL / metrics.totalTrades;

    // Calculate daily metrics
    const dailyPnL = new Map<string, number>();
    trades.forEach(trade => {
      const date = format(new Date(trade.date), 'yyyy-MM-dd');
      dailyPnL.set(date, (dailyPnL.get(date) || 0) + (trade.pnl || 0));
    });

    metrics.totalTradingDays = dailyPnL.size;
    let currentWinningStreak = 0;
    let currentLosingStreak = 0;
    let maxWinningStreak = 0;
    let maxLosingStreak = 0;

    dailyPnL.forEach(pnl => {
      if (pnl > 0) {
        metrics.winningDays++;
        metrics.averageWinningDayPnL += pnl;
        currentWinningStreak++;
        maxWinningStreak = Math.max(maxWinningStreak, currentWinningStreak);
        currentLosingStreak = 0;
        metrics.largestProfitableDay = Math.max(metrics.largestProfitableDay, pnl);
      } else if (pnl < 0) {
        metrics.losingDays++;
        metrics.averageLosingDayPnL += pnl;
        currentLosingStreak++;
        maxLosingStreak = Math.max(maxLosingStreak, currentLosingStreak);
        currentWinningStreak = 0;
        metrics.largestLosingDay = Math.min(metrics.largestLosingDay, pnl);
      } else {
        metrics.breakEvenDays++;
      }
    });

    metrics.maxConsecutiveWinningDays = maxWinningStreak;
    metrics.maxConsecutiveLosingDays = maxLosingStreak;

    if (metrics.winningDays > 0) {
      metrics.averageWinningDayPnL /= metrics.winningDays;
    }
    if (metrics.losingDays > 0) {
      metrics.averageLosingDayPnL /= metrics.losingDays;
    }
    metrics.averageDailyPnL = metrics.totalPnL / metrics.totalTradingDays;

    // Calculate monthly metrics
    const monthlyPnL = new Map<string, number>();
    trades.forEach(trade => {
      const month = format(new Date(trade.date), 'yyyy-MM');
      monthlyPnL.set(month, (monthlyPnL.get(month) || 0) + (trade.pnl || 0));
    });

    const monthlyValues = Array.from(monthlyPnL.values());
    metrics.bestMonth = Math.max(...monthlyValues);
    metrics.worstMonth = Math.min(...monthlyValues);
    metrics.averageMonthlyPnL = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length;

    // Calculate profit factor
    const grossProfit = trades
      .filter(trade => (trade.pnl || 0) > 0)
      .reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const grossLoss = Math.abs(trades
      .filter(trade => (trade.pnl || 0) < 0)
      .reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    metrics.profitFactor = grossLoss !== 0 ? grossProfit / grossLoss : 0;

    // Calculate trade expectancy
    const winRate = metrics.winningTrades / metrics.totalTrades;
    const lossRate = metrics.losingTrades / metrics.totalTrades;
    metrics.tradeExpectancy = (winRate * metrics.averageWin) + (lossRate * metrics.averageLoss);

    return metrics;
  }, [trades]);

  // Calculate monthly statistics
  const monthlyStats = useMemo(() => {
    const months = new Map();
    trades.forEach(trade => {
      const monthKey = format(parseISO(trade.date), 'yyyy-MM');
      const current = months.get(monthKey) || { pnl: 0, trades: 0 };
      current.pnl += trade.pnl || 0;
      current.trades += 1;
      months.set(monthKey, current);
    });

    const monthlyPnLs = Array.from(months.values()).map(m => m.pnl);
    return {
      bestMonth: Math.max(...monthlyPnLs),
      worstMonth: Math.min(...monthlyPnLs),
      averageMonthlyPnL: monthlyPnLs.reduce((a, b) => a + b, 0) / monthlyPnLs.length
    };
  }, [trades]);

  // Calculate advanced metrics
  const advancedMetrics = useMemo(() => {
    // Time-based analysis
    const hourlyPerformance = Array(24).fill(0).map((_, hour) => {
      const tradesInHour = trades.filter(trade => getHours(new Date(trade.date)) === hour);
      const winningTrades = tradesInHour.filter(trade => trade.pnl && trade.pnl > 0);
      return {
        hour,
        trades: tradesInHour.length,
        winRate: tradesInHour.length > 0 ? (winningTrades.length / tradesInHour.length) * 100 : 0,
        avgPnL: tradesInHour.length > 0 
          ? tradesInHour.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / tradesInHour.length 
          : 0
      };
    });

    const dailyPerformance = Array(7).fill(0).map((_, day) => {
      const tradesInDay = trades.filter(trade => getDay(new Date(trade.date)) === day);
      const winningTrades = tradesInDay.filter(trade => trade.pnl && trade.pnl > 0);
      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
        trades: tradesInDay.length,
        winRate: tradesInDay.length > 0 ? (winningTrades.length / tradesInDay.length) * 100 : 0,
        avgPnL: tradesInDay.length > 0 
          ? tradesInDay.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / tradesInDay.length 
          : 0
      };
    });

    // Risk metrics
    const returns = trades.map(trade => trade.pnl || 0);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;
    
    const negativeReturns = returns.filter(ret => ret < 0);
    const downsideDeviation = Math.sqrt(
      negativeReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / negativeReturns.length
    );
    const sortinoRatio = downsideDeviation !== 0 ? avgReturn / downsideDeviation : 0;

    // Drawdown analysis
    let peak = 0;
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    let drawdownPeriods: { start: Date; end: Date; amount: number }[] = [];
    let currentDrawdownStart: Date | null = null;

    trades.reduce((equity, trade) => {
      const newEquity = equity + (trade.pnl || 0);
      if (newEquity > peak) {
        peak = newEquity;
        if (currentDrawdownStart) {
          drawdownPeriods.push({
            start: currentDrawdownStart,
            end: new Date(trade.date),
            amount: currentDrawdown
          });
          currentDrawdownStart = null;
          currentDrawdown = 0;
        }
      } else {
        const drawdown = (peak - newEquity) / peak;
        if (drawdown > currentDrawdown) {
          currentDrawdown = drawdown;
          if (!currentDrawdownStart) {
            currentDrawdownStart = new Date(trade.date);
          }
        }
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
      return newEquity;
    }, 0);

    // Trade correlation analysis
    const symbols = [...new Set(trades.map(trade => trade.symbol))];
    const correlationMatrix = symbols.map(symbol1 => {
      const trades1 = trades.filter(trade => trade.symbol === symbol1);
      return symbols.map(symbol2 => {
        const trades2 = trades.filter(trade => trade.symbol === symbol2);
        // Calculate correlation between trades of these symbols
        const correlation = calculateCorrelation(
          trades1.map(t => t.pnl || 0),
          trades2.map(t => t.pnl || 0)
        );
        return {
          symbol1,
          symbol2,
          correlation
        };
      });
    });

    return {
      hourlyPerformance,
      dailyPerformance,
      sharpeRatio,
      sortinoRatio,
      maxDrawdown,
      drawdownPeriods,
      correlationMatrix
    };
  }, [trades]);

  // Helper function to calculate correlation
  const calculateCorrelation = (arr1: number[], arr2: number[]): number => {
    const mean1 = arr1.reduce((sum, val) => sum + val, 0) / arr1.length;
    const mean2 = arr2.reduce((sum, val) => sum + val, 0) / arr2.length;
    
    const variance1 = arr1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / arr1.length;
    const variance2 = arr2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / arr2.length;
    
    const covariance = arr1.reduce((sum, val, i) => 
      sum + (val - mean1) * (arr2[i] - mean2), 0) / arr1.length;
    
    return covariance / (Math.sqrt(variance1) * Math.sqrt(variance2));
  };

  const filterSections: FilterSection[] = [
    {
      title: 'Date & Time',
      icon: <Calendar className="w-4 h-4" />,
      items: ['Days', 'Weeks', 'Months', 'Custom Range']
    },
    {
      title: 'Trade Time',
      icon: <Clock className="w-4 h-4" />,
      items: ['Market Open', 'Market Close', 'Pre-Market', 'After Hours']
    },
    {
      title: 'Price & Quantity',
      icon: <DollarSign className="w-4 h-4" />,
      items: ['Price Range', 'Volume', 'Instrument Type']
    },
    {
      title: 'Risk',
      icon: <AlertTriangle className="w-4 h-4" />,
      items: ['R-Multiple', 'Position Size', 'Risk/Reward']
    },
    {
      title: 'Tags',
      icon: <Tag className="w-4 h-4" />,
      items: ['Setups', 'Mistakes', 'Market Conditions']
    },
    {
      title: 'Wins vs Losses',
      icon: <TrendingUp className="w-4 h-4" />,
      items: ['Win Rate', 'Profit Factor', 'Average Win/Loss']
    },
    {
      title: 'Compare',
      icon: <BarChart3 className="w-4 h-4" />,
      items: ['Period Comparison', 'Strategy Comparison']
    },
    {
      title: 'Calendar',
      icon: <CalendarIcon className="w-4 h-4" />,
      items: ['Daily View', 'Weekly View', 'Monthly View']
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Trade Analysis
          </h1>
          <div className="flex space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Time Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock4 className="w-5 h-5 mr-2 text-blue-400" />
              Time-Based Analysis
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Performance */}
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <h3 className="text-lg font-medium mb-4">Hourly Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={advancedMetrics.hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="winRate" fill="#3b82f6" name="Win Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Performance */}
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <h3 className="text-lg font-medium mb-4">Daily Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={advancedMetrics.dailyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="winRate" fill="#8b5cf6" name="Win Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]"
        >
          <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Best Month</div>
              <div className="text-2xl font-bold text-green-400">
                ${performanceMetrics.bestMonth.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Worst Month</div>
              <div className="text-2xl font-bold text-red-400">
                ${performanceMetrics.worstMonth.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Average Monthly P&L</div>
              <div className="text-2xl font-bold text-white">
                ${performanceMetrics.averageMonthlyPnL.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trade Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]"
        >
          <h2 className="text-xl font-semibold mb-6">Trade Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Average Win</div>
              <div className="text-2xl font-bold text-green-400">
                ${performanceMetrics.averageWin.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Average Loss</div>
              <div className="text-2xl font-bold text-red-400">
                ${Math.abs(performanceMetrics.averageLoss).toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Average Trade P&L</div>
              <div className="text-2xl font-bold text-white">
                ${performanceMetrics.averageTradePnL.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Profit Factor</div>
              <div className="text-2xl font-bold text-white">
                {performanceMetrics.profitFactor.toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Gauge className="w-5 h-5 mr-2 text-blue-400" />
              Risk Metrics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sharpe Ratio */}
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex items-center space-x-2 mb-2">
                <LineChartIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-medium">Sharpe Ratio</h3>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {advancedMetrics.sharpeRatio.toFixed(2)}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Risk-adjusted return measure
              </p>
            </div>

            {/* Sortino Ratio */}
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-medium">Sortino Ratio</h3>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {advancedMetrics.sortinoRatio.toFixed(2)}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Downside risk-adjusted return
              </p>
            </div>

            {/* Max Drawdown */}
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-medium">Max Drawdown</h3>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {(advancedMetrics.maxDrawdown * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Largest peak-to-trough decline
              </p>
            </div>
          </div>

          {/* Drawdown Periods */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Drawdown Periods</h3>
            <div className="space-y-2">
              {advancedMetrics.drawdownPeriods.map((period, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400">
                        {format(period.start, 'MMM d, yyyy')} - {format(period.end, 'MMM d, yyyy')}
                      </div>
                      <div className="text-lg font-medium text-red-400">
                        {(period.amount * 100).toFixed(1)}% Drawdown
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trade Correlation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <ArrowRightLeft className="w-5 h-5 mr-2 text-blue-400" />
              Trade Correlation Analysis
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Symbol</th>
                  {advancedMetrics.correlationMatrix[0]?.map((corr, i) => (
                    <th key={i} className="px-4 py-2 text-center text-sm font-medium text-gray-400">
                      {corr.symbol2}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {advancedMetrics.correlationMatrix.map((row, i) => (
                  <tr key={i} className="border-b border-[#2a2a2a]">
                    <td className="px-4 py-2 text-sm font-medium">{row[0].symbol1}</td>
                    {row.map((corr, j) => (
                      <td key={j} className="px-4 py-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded ${
                          corr.correlation > 0.7 ? 'bg-green-500/20 text-green-400' :
                          corr.correlation < -0.7 ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {corr.correlation.toFixed(2)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Cost Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]"
        >
          <h2 className="text-xl font-semibold mb-6">Cost Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Total Commissions</div>
              <div className="text-2xl font-bold text-white">
                ${performanceMetrics.totalCommissions.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Total Fees</div>
              <div className="text-2xl font-bold text-white">
                ${performanceMetrics.totalFees.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="text-sm text-gray-400 mb-1">Total Swap</div>
              <div className="text-2xl font-bold text-white">
                ${performanceMetrics.totalSwap.toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 