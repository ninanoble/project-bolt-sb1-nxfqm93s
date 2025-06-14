import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Trade, TradeSummary, ViewMode } from '../types/trade';
import { startOfWeek, startOfMonth, format, isWithinInterval, parseISO } from 'date-fns';

export function useTrades() {
  const [trades, setTrades] = useLocalStorage<Trade[]>('nbs-trades', []);
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addTrade = (tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrades(prev => [...prev, newTrade]);
  };

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(prev =>
      prev.map(trade =>
        trade.id === id
          ? { ...trade, ...updates, updatedAt: new Date().toISOString() }
          : trade
      )
    );
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  const getFilteredTrades = useMemo(() => {
    const now = selectedDate;
    
    switch (viewMode) {
      case 'daily':
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return trades.filter(trade => {
          const tradeDate = parseISO(trade.date);
          return isWithinInterval(tradeDate, { start: dayStart, end: dayEnd });
        });
      
      case 'weekly':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return trades.filter(trade => {
          const tradeDate = parseISO(trade.date);
          return isWithinInterval(tradeDate, { start: weekStart, end: weekEnd });
        });
      
      case 'monthly':
        const monthStart = startOfMonth(now);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        return trades.filter(trade => {
          const tradeDate = parseISO(trade.date);
          return isWithinInterval(tradeDate, { start: monthStart, end: monthEnd });
        });
      
      default:
        return trades;
    }
  }, [trades, viewMode, selectedDate]);

  const calculateSummary = (tradesToAnalyze: Trade[]): TradeSummary => {
    const closedTrades = tradesToAnalyze.filter(trade => trade.status === 'closed' && trade.pnl !== undefined);
    
    if (closedTrades.length === 0) {
      return {
        period: format(selectedDate, viewMode === 'daily' ? 'PPP' : viewMode === 'weekly' ? "'Week of' PPP" : 'MMMM yyyy'),
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnL: 0,
        grossProfit: 0,
        grossLoss: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        largestWin: 0,
        largestLoss: 0,
        totalCommission: 0,
        netPnL: 0,
      };
    }

    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = closedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const grossProfit = winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    const totalCommission = closedTrades.reduce((sum, trade) => sum + trade.commission, 0);
    const totalPnL = grossProfit - grossLoss;
    const netPnL = totalPnL - totalCommission;

    return {
      period: format(selectedDate, viewMode === 'daily' ? 'PPP' : viewMode === 'weekly' ? "'Week of' PPP" : 'MMMM yyyy'),
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: winningTrades.length / closedTrades.length * 100,
      totalPnL,
      grossProfit,
      grossLoss,
      averageWin: winningTrades.length > 0 ? grossProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? grossLoss / losingTrades.length : 0,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl || 0)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl || 0)) : 0,
      totalCommission,
      netPnL,
    };
  };

  const summary = useMemo(() => calculateSummary(getFilteredTrades), [getFilteredTrades, selectedDate, viewMode]);

  return {
    trades: getFilteredTrades,
    allTrades: trades,
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    summary,
    addTrade,
    updateTrade,
    deleteTrade,
  };
}