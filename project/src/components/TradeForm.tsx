import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Info } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-xl font-bold"
          >
            {trade ? 'Edit Trade' : 'Add New Trade'}
          </motion.h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Info Display */}
          <AnimatePresence>
            {contractInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-lg border ${
                  isDark 
                    ? 'bg-blue-900/20 border-blue-800/30' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Contract Specifications</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tick Size:</span>
                    <span className="ml-2 font-medium">{contractInfo.tickSize}</span>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tick Value:</span>
                    <span className="ml-2 font-medium">${contractInfo.tickValue}</span>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Point Value:</span>
                    <span className="ml-2 font-medium">${contractInfo.pointValue}</span>
                  </div>
                  {estimatedPnL !== null && (
                    <div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Est. P&L:</span>
                      <span className={`ml-2 font-medium ${
                        estimatedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${estimatedPnL.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Basic Trade Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Trade Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="ES, NQ, CL, etc."
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Side
                </label>
                <select
                  value={formData.side}
                  onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'long' | 'short' }))}
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Contract
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="1"
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                  placeholder="4500.00"
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'open' | 'closed' }))}
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <AnimatePresence>
                {formData.status === 'closed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Exit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.exitPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: e.target.value }))}
                      placeholder="4520.00"
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Stop Loss
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: e.target.value }))}
                  placeholder="4480.00"
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Take Profit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: e.target.value }))}
                  placeholder="4540.00"
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Commission
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.commission}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                  placeholder="2.50"
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Strategy
                </label>
                <input
                  type="text"
                  value={formData.strategy}
                  onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                  placeholder="Breakout, Pullback, etc."
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Timeframe
                </label>
                <input
                  type="text"
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                  placeholder="5m, 15m, 1h, 1d"
                  className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="momentum, breakout, reversal"
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </motion.div>

          {/* Journal Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Trading Journal</h3>
            <div className="space-y-6">
              {[
                { key: 'preTradingRoutine', label: 'Pre-Trading Routine', placeholder: 'Market analysis, setup identification, risk assessment...' },
                { key: 'newsAndNotes', label: 'News & Notes', placeholder: 'Market news, economic events, sector analysis...' },
                { key: 'dailyRecap', label: 'Daily Recap: Post Session Review', placeholder: 'Session summary, key observations, market behavior...' },
                { key: 'tradesTakenToday', label: 'Trades Taken Today (supports links)', placeholder: 'List of trades, screenshots, chart links, analysis...' },
                { key: 'markupsFromTradingDay', label: 'Markups From The Trading Day (one per line, supports links)', placeholder: 'Chart markups, screenshots, analysis links...' },
                { key: 'endOfDayEvaluation', label: 'End of Day Evaluation', placeholder: 'Performance review, lessons learned, areas for improvement...' }
              ].map((field, index) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {field.label}
                  </label>
                  <textarea
                    value={formData[field.key as keyof typeof formData] as string}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Basic Notes (fallback) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Trade notes, market conditions, lessons learned, etc."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </motion.div>

          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>{trade ? 'Update Trade' : 'Add Trade'}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}