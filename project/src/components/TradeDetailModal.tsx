import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Calendar, TrendingUp, TrendingDown, DollarSign, Target, Clock, FileText, Link, Image } from 'lucide-react';
import { Trade } from '../types/trade';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface TradeDetailModalProps {
  trade: Trade;
  onClose: () => void;
  onEdit?: (trade: Trade) => void;
}

export function TradeDetailModal({ trade, onClose, onEdit }: TradeDetailModalProps) {
  const { isDark } = useTheme();

  const renderSection = (title: string, content: string | undefined, icon: React.ReactNode) => {
    if (!content) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-4 transition-colors duration-300 ${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-2 mb-3">
          {icon}
          <h4 className={`font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h4>
        </div>
        <div className={`whitespace-pre-wrap leading-relaxed ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {content}
        </div>
      </motion.div>
    );
  };

  const renderLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline inline-flex items-center"
          >
            <Link className="w-3 h-3 mr-1" />
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 border-b p-6 flex items-center justify-between transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {trade.symbol}
              </span>
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                trade.side === 'long' 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {trade.side === 'long' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="capitalize">{trade.side}</span>
              </span>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                trade.status === 'open' 
                  ? 'bg-yellow-900 text-yellow-300' 
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {trade.status}
              </span>
            </div>
            <div className={`flex items-center ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar className="w-4 h-4 mr-2" />
              {format(parseISO(trade.date), 'EEEE, MMMM dd, yyyy')}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <motion.button
                onClick={() => onEdit(trade)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </motion.button>
            )}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Trade Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Contract', value: trade.quantity, icon: Target, color: 'blue' },
              { label: 'Entry Price', value: `$${trade.entryPrice.toFixed(2)}`, icon: DollarSign, color: 'green' },
              { label: 'Exit Price', value: trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : 'Open', icon: DollarSign, color: 'red' },
              { label: 'P&L', value: trade.pnl !== undefined ? `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}` : 'Pending', icon: TrendingUp, color: 'purple' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg p-4 transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Trade Details */}
          {(trade.stopLoss || trade.takeProfit || trade.strategy || trade.timeframe) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { label: 'Stop Loss', value: trade.stopLoss ? `$${trade.stopLoss.toFixed(2)}` : null },
                { label: 'Take Profit', value: trade.takeProfit ? `$${trade.takeProfit.toFixed(2)}` : null },
                { label: 'Strategy', value: trade.strategy },
                { label: 'Timeframe', value: trade.timeframe }
              ].filter(item => item.value).map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-lg p-4 transition-colors duration-300 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-sm mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tags */}
          {trade.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className={`font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {trade.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Journal Sections */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {renderSection(
              'Pre-Trading Routine',
              trade.preTradingRoutine,
              <FileText className="w-4 h-4 text-blue-400" />
            )}
            
            {renderSection(
              'News & Notes',
              trade.newsAndNotes,
              <FileText className="w-4 h-4 text-green-400" />
            )}
            
            {renderSection(
              'Daily Recap: Post Session Review',
              trade.dailyRecap,
              <Clock className="w-4 h-4 text-purple-400" />
            )}
            
            {trade.tradesTakenToday && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-4 h-4 text-orange-400" />
                  <h4 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Trades Taken Today
                  </h4>
                </div>
                <div className={`whitespace-pre-wrap leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {renderLinks(trade.tradesTakenToday)}
                </div>
              </motion.div>
            )}
            
            {trade.markupsFromTradingDay && trade.markupsFromTradingDay.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Image className="w-4 h-4 text-pink-400" />
                  <h4 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Markups From Trading Day
                  </h4>
                </div>
                <div className="space-y-2">
                  {trade.markupsFromTradingDay.map((markup, index) => (
                    <div key={index} className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {renderLinks(markup)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {renderSection(
              'End of Day Evaluation',
              trade.endOfDayEvaluation,
              <TrendingUp className="w-4 h-4 text-yellow-400" />
            )}
          </motion.div>

          {/* Basic Notes (if no journal sections) */}
          {trade.notes && !trade.preTradingRoutine && !trade.newsAndNotes && !trade.dailyRecap && (
            renderSection(
              'Notes',
              trade.notes,
              <FileText className="w-4 h-4 text-gray-400" />
            )
          )}

          {/* Timestamps */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`border-t pt-4 text-sm transition-colors duration-300 ${
              isDark 
                ? 'border-gray-600 text-gray-400' 
                : 'border-gray-200 text-gray-600'
            }`}
          >
            <div>Created: {format(parseISO(trade.createdAt), 'PPpp')}</div>
            <div>Updated: {format(parseISO(trade.updatedAt), 'PPpp')}</div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}