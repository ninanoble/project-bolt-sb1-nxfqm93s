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
import { BarChart3, Calendar, TrendingUp, Shield, Plus, Settings, LogOut, BookOpen, Sun, Moon, Quote, TrendingDown, DollarSign, ChevronRight, Edit2, Eye } from 'lucide-react';
import { ViewMode, Trade } from '../types/trade';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Area } from 'recharts';

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

  // Calculate trading day metrics
  const tradingDayMetrics = {
    winningDays: trades.filter(t => t.pnl !== undefined && t.pnl > 0).length,
    losingDays: trades.filter(t => t.pnl !== undefined && t.pnl < 0).length,
    totalTradingDays: trades.length,
    winRate: trades.length > 0 ? (trades.filter(t => t.pnl !== undefined && t.pnl > 0).length / trades.length * 100).toFixed(1) : '0.0'
  };

  // Add account balance editing functionality
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAccountBalance(value);
    }
  };

  // Calculate equity curve data with account balance
  const equityData = useMemo(() => {
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const data = [{
      date: new Date(sortedTrades[0]?.date || new Date()),
      equity: accountBalance,
      pnl: 0
    }];

    let runningEquity = accountBalance;
    sortedTrades.forEach(trade => {
      if (trade.pnl !== undefined) {
        runningEquity += trade.pnl;
        data.push({
          date: new Date(trade.date),
          equity: runningEquity,
          pnl: trade.pnl
        });
      }
    });

    return data;
  }, [trades, accountBalance]);

  const handleLogout = () => {
    logout();
  };

  const handleAddTrade = (tradeData: any) => {
    addTrade(tradeData);
    setShowTradeForm(false);
    setIsAddingTrade(false);
  };

  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade.id);
    setShowTradeForm(true);
  };

  const handleUpdateTrade = (tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTrade) {
      updateTrade(selectedTrade, tradeData);
      setSelectedTrade(null);
      setShowTradeForm(false);
    }
  };

  const handleViewTrade = (trade: Trade) => {
    setShowTradeDetail(trade.id);
  };

  const navItems = [
    { id: 'daily' as ViewMode, label: 'Daily', icon: Calendar },
    { id: 'weekly' as ViewMode, label: 'Weekly', icon: BarChart3 },
    { id: 'monthly' as ViewMode, label: 'Monthly', icon: TrendingUp },
    { id: 'tradelog' as ViewMode, label: 'Trade Log', icon: BookOpen },
  ];

  // Add account balance display and edit functionality
  const renderAccountBalance = () => (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Account Balance:
      </span>
      {isEditingBalance ? (
        <input
          type="number"
          value={accountBalance}
          onChange={handleBalanceChange}
          onBlur={() => setIsEditingBalance(false)}
          className={`w-32 px-2 py-1 rounded border ${
            isDark 
              ? 'bg-black border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsEditingBalance(true)}
          className={`text-sm font-medium ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
          }`}
        >
          ${accountBalance.toLocaleString()}
        </button>
      )}
    </div>
  );

  const dailyTrades = useMemo(() => {
    return trades.filter(trade => isSameDay(new Date(trade.date), selectedDate));
  }, [trades, selectedDate]);

  const totalPnL = useMemo(() => {
    return trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  }, [trades]);

  const profitFactor = useMemo(() => {
    const totalWinningPnL = trades.reduce((sum, trade) => (trade.pnl && trade.pnl > 0 ? sum + trade.pnl : sum), 0);
    const totalLosingPnL = trades.reduce((sum, trade) => (trade.pnl && trade.pnl < 0 ? sum + Math.abs(trade.pnl) : sum), 0);
    return totalLosingPnL > 0 ? (totalWinningPnL / totalLosingPnL) : (totalWinningPnL > 0 ? Infinity : 0);
  }, [trades]);

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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${
          isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
      } border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                NBS Journal
              </span>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id)}
                  className={`flex items-center space-x-2 text-sm font-medium ${
                    viewMode === item.id
                      ? isDark ? 'text-blue-400' : 'text-blue-600'
                      : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {renderAccountBalance()}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDark 
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`p-2 rounded-lg ${
                  isDark 
                    ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Add Trade Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowTradeForm(true);
              setIsAddingTrade(true);
            }}
            className={`p-4 rounded-full shadow-lg ${
              isDark 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
          </div>

        {/* Trade Form Modal */}
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

        {/* Trade Detail Modal */}
        <AnimatePresence>
          {showTradeDetail && (
            <TradeDetailModal
              trade={trades.find(t => t.id === showTradeDetail)!}
              onClose={() => setShowTradeDetail(null)}
              onEdit={handleEditTrade}
            />
          )}
        </AnimatePresence>

        {/* Content based on view mode */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-5 h-5 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Win Rate</h3>
              </div>
              <p className={`text-2xl font-bold mt-2 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>{tradingDayMetrics.winRate}%</p>
            </div>
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-2">
                <Calendar className={`w-5 h-5 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Trading Days</h3>
              </div>
              <p className={`text-2xl font-bold mt-2 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>{tradingDayMetrics.totalTradingDays}</p>
            </div>
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-2">
                <Shield className={`w-5 h-5 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Account Balance</h3>
              </div>
              <div className="flex items-center mt-2">
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>${accountBalance.toLocaleString()}</p>
                <button
                  onClick={() => setIsEditingBalance(true)}
                  className={`ml-2 p-1 rounded ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar and Trade Log Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PnL Calendar */}
            <div className={`lg:col-span-2 p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>PnL Calendar</h2>
              </div>
              <div className="h-[500px]">
                <PnLCalendar
                  trades={trades}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
          </div>

            {/* Trade Log */}
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Trade Log</h2>
              <div className="space-y-4">
                {trades.map((trade) => (
                  <div
                    key={trade.id}
                    className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${
                          isDark ? 'text-gray-200' : 'text-gray-800'
                        }`}>{trade.symbol}</h3>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>{new Date(trade.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`font-medium ${
                          trade.pnl && trade.pnl >= 0
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {trade.pnl ? `$${trade.pnl.toLocaleString()}` : '-'}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowTradeDetail(trade.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trade.side === 'long'
                          ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                          : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                      }`}>
                        {trade.side.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trade.status === 'open'
                          ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                          : isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}