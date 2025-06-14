import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../types/trade';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface TradeListProps {
  trades: Trade[];
  onEdit?: (trade: Trade) => void;
  onDelete?: (id: string) => void;
}

export function TradeList({ trades, onEdit, onDelete }: TradeListProps) {
  const { isDark } = useTheme();

  if (trades.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-8 text-center transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800' 
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className={`mb-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No trades found
        </div>
        <div className={`text-sm ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Add your first trade to get started
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg overflow-hidden transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800' 
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              {['Date', 'Symbol', 'Side', 'Contract', 'Entry', 'Exit', 'P&L', 'Status', 'Actions'].map((header, index) => (
                <motion.th
                  key={header}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {header}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDark ? 'divide-gray-600' : 'divide-gray-200'
          }`}>
            {trades.map((trade, index) => (
              <motion.tr 
                key={trade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 0.8)' }}
                className="transition-colors"
              >
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {format(parseISO(trade.date), 'MMM dd, yyyy')}
                </td>
                <td className={`px-6 py-4 text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {trade.symbol}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    trade.side === 'long' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {trade.side === 'long' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="capitalize">{trade.side}</span>
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {trade.quantity.toLocaleString()}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  ${trade.entryPrice.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {trade.pnl !== undefined ? (
                    <span className={`font-medium ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </span>
                  ) : (
                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    trade.status === 'open' 
                      ? 'bg-yellow-900 text-yellow-300' 
                      : 'bg-blue-900 text-blue-300'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <motion.button
                        onClick={() => onEdit(trade)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1 transition-colors ${
                          isDark 
                            ? 'text-gray-400 hover:text-blue-400' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                    )}
                    {onDelete && (
                      <motion.button
                        onClick={() => onDelete(trade.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1 transition-colors ${
                          isDark 
                            ? 'text-gray-400 hover:text-red-400' 
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}