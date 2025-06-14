import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Info, TrendingUp, TrendingDown, Calendar, Tag, DollarSign, Target, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Trade } from '../types/trade';
import { calculatePnL, getContractInfo, formatPrice } from '../utils/contractSpecs';
import { useTheme } from '../contexts/ThemeContext';

interface TradeFormProps {
  onSubmit: (tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  trade?: Trade;
}

export function TradeForm({ onSubmit, onClose, trade }: TradeFormProps) {
  const { isDark } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: trade?.date || new Date().toISOString().split('T')[0],
    symbol: trade?.symbol || '',
    side: trade?.side || 'long' as 'long' | 'short',
    quantity: trade?.quantity?.toString() || '',
    entryPrice: trade?.entryPrice?.toString() || '',
    exitPrice: trade?.exitPrice?.toString() || '',
    stopLoss: trade?.stopLoss?.toString() || '',
    takeProfit: trade?.takeProfit?.toString() || '',
    commission: trade?.commission?.toString() || '',
    status: trade?.status || 'open' as 'open' | 'closed',
    notes: trade?.notes || '',
    strategy: trade?.strategy || '',
    timeframe: trade?.timeframe || '',
    tags: trade?.tags?.join(', ') || '',
    // New journaling fields
    preTradingRoutine: trade?.preTradingRoutine || '',
    newsAndNotes: trade?.newsAndNotes || '',
    dailyRecap: trade?.dailyRecap || '',
    postSessionReview: trade?.postSessionReview || '',
    tradesTakenToday: trade?.tradesTakenToday || '',
    markupsFromTradingDay: trade?.markupsFromTradingDay?.join('\n') || '',
    endOfDayEvaluation: trade?.endOfDayEvaluation || '',
  });

  const contractInfo = getContractInfo(formData.symbol);
  const estimatedPnL = formData.exitPrice && formData.entryPrice && formData.quantity && formData.symbol
    ? calculatePnL(
        formData.symbol,
        formData.side,
        parseFloat(formData.quantity),
        parseFloat(formData.entryPrice),
        parseFloat(formData.exitPrice)
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : undefined;
    const entryPrice = parseFloat(formData.entryPrice);
    const quantity = parseFloat(formData.quantity);
    
    let pnl: number | undefined;
    if (formData.status === 'closed' && exitPrice) {
      pnl = calculatePnL(formData.symbol, formData.side, quantity, entryPrice, exitPrice);
    }

    const trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'> = {
      date: formData.date,
      symbol: formData.symbol.toUpperCase(),
      side: formData.side,
      quantity: quantity,
      entryPrice: entryPrice,
      exitPrice: exitPrice,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      pnl,
      commission: parseFloat(formData.commission) || 0,
      status: formData.status,
      notes: formData.notes,
      strategy: formData.strategy,
      timeframe: formData.timeframe,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      // New journaling fields
      preTradingRoutine: formData.preTradingRoutine,
      newsAndNotes: formData.newsAndNotes,
      dailyRecap: formData.dailyRecap,
      postSessionReview: formData.postSessionReview,
      tradesTakenToday: formData.tradesTakenToday,
      markupsFromTradingDay: formData.markupsFromTradingDay
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean),
      endOfDayEvaluation: formData.endOfDayEvaluation,
    };

    onSubmit(trade);
    setShowSuccess(true);
    
    // Close the form after a short delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#1a1a1a] shadow-2xl"
      >
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Trade successfully added!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-8">
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            {trade ? 'Edit Trade' : 'Add New Trade'}
          </motion.h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trade Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]">
            <h3 className="col-span-2 text-lg font-semibold text-white mb-2 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
              Trade Details
            </h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-blue-400" />
                  Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="ES, NQ, CL, etc."
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                {formData.side === 'long' ? (
                  <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
                )}
                  Side
                </label>
                <select
                  value={formData.side}
                  onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'long' | 'short' }))}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-400" />
                  Contract
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="1"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-blue-400" />
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                  placeholder="4500.00"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-blue-400" />
                      Exit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.exitPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: e.target.value }))}
                placeholder="4500.00"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Target className="w-4 h-4 mr-2 text-red-400" />
                  Stop Loss
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: e.target.value }))}
                placeholder="Stop Loss Price"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Target className="w-4 h-4 mr-2 text-green-400" />
                  Take Profit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: e.target.value }))}
                placeholder="Take Profit Price"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-blue-400" />
                  Commission
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.commission}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                Status
                </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'open' | 'closed' }))}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* PnL Calculation Display */}
            {estimatedPnL !== null && (
              <div className="col-span-2 mt-4 p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className={`w-5 h-5 ${estimatedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="text-sm font-medium text-gray-300">Estimated P&L:</span>
                  </div>
                  <span className={`text-lg font-bold ${estimatedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {estimatedPnL >= 0 ? '+' : ''}{estimatedPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]">
            <h3 className="col-span-2 text-lg font-semibold text-white mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Additional Details
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Strategy</label>
                <input
                  type="text"
                  value={formData.strategy}
                  onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                placeholder="Enter strategy"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Timeframe</label>
                <input
                  type="text"
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                placeholder="e.g., 5min, 15min, 1H"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-blue-400" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="momentum, breakout, reversal"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-medium text-gray-300">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Trade notes, market conditions, lessons learned, etc."
              rows={3}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Journaling Details Section */}
          <div className="grid grid-cols-1 gap-6 p-6 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a]">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Journaling Details
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Pre-Trading Routine</label>
              <textarea
                value={formData.preTradingRoutine}
                onChange={(e) => setFormData(prev => ({ ...prev, preTradingRoutine: e.target.value }))}
                placeholder="Describe your pre-trading routine and preparation..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">News and Market Notes</label>
              <textarea
                value={formData.newsAndNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, newsAndNotes: e.target.value }))}
                placeholder="Enter relevant news and market conditions..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Daily Recap</label>
              <textarea
                value={formData.dailyRecap}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyRecap: e.target.value }))}
                placeholder="Summarize your trading day..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Post-Session Review</label>
              <textarea
                value={formData.postSessionReview}
                onChange={(e) => setFormData(prev => ({ ...prev, postSessionReview: e.target.value }))}
                placeholder="Review your trading session..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Trades Taken Today</label>
              <textarea
                value={formData.tradesTakenToday}
                onChange={(e) => setFormData(prev => ({ ...prev, tradesTakenToday: e.target.value }))}
                placeholder="List all trades taken today..."
                rows={2}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Markups from Trading Day</label>
              <textarea
                value={formData.markupsFromTradingDay}
                onChange={(e) => setFormData(prev => ({ ...prev, markupsFromTradingDay: e.target.value }))}
                placeholder="Add key points and lessons from today's trading..."
                rows={3}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">End of Day Evaluation</label>
              <textarea
                value={formData.endOfDayEvaluation}
                onChange={(e) => setFormData(prev => ({ ...prev, endOfDayEvaluation: e.target.value }))}
                placeholder="Evaluate your overall performance and plan for tomorrow..."
                rows={3}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>{trade ? 'Update Trade' : 'Add Trade'}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border border-[#2a2a2a]"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}