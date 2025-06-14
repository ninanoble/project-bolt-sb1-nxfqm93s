import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Edit2, Calendar, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Trade } from '../types/trade';
import { format, parseISO } from 'date-fns';
import { TradeDetailModal } from './TradeDetailModal';
import { useTheme } from '../contexts/ThemeContext';

interface TradeLogProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onView: (trade: Trade) => void;
  onDelete: (tradeId: string) => void;
}

type FilterStatus = 'all' | 'open' | 'closed';
type SortBy = 'date' | 'symbol' | 'pnl';

export function TradeLog({ trades, onEdit, onView, onDelete }: TradeLogProps) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const filteredTrades = trades
    .filter(trade => {
      const matchesSearch = 
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.strategy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' || 
        trade.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return parseISO(b.date).getTime() - parseISO(a.date).getTime();
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'pnl':
          return (b.pnl || 0) - (a.pnl || 0);
        default:
          return 0;
      }
    });

  return (
    <div className={`rounded-lg transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Search and Filter Bar */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-black border-gray-800 text-white placeholder-gray-500 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className={`px-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-black border-gray-800 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className={`px-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-black border-gray-800 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="date">Sort by Date</option>
              <option value="symbol">Sort by Symbol</option>
              <option value="pnl">Sort by P/L</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>Date</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>Symbol</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>Side</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>Status</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>P/L</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDark ? 'divide-gray-800' : 'divide-gray-200'
          }`}>
            {filteredTrades.map((trade) => (
              <tr key={trade.id} className={`${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              }`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {format(parseISO(trade.date), 'MMM d, yyyy')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {trade.symbol}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  trade.side === 'long' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {trade.side.toUpperCase()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  trade.status === 'open' 
                    ? 'text-yellow-400' 
                    : 'text-blue-400'
                }`}>
                  {trade.status.toUpperCase()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  trade.pnl && trade.pnl > 0 
                    ? 'text-green-400' 
                    : trade.pnl && trade.pnl < 0 
                    ? 'text-red-400' 
                    : isDark 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                }`}>
                  {trade.pnl ? `$${trade.pnl.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onView(trade)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(trade)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(trade.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-red-400 hover:text-red-300 hover:bg-gray-800' 
                          : 'text-red-500 hover:text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Detail Modal */}
      <AnimatePresence>
        {selectedTrade && (
          <TradeDetailModal
            trade={selectedTrade}
            onClose={() => setSelectedTrade(null)}
            onEdit={onEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}