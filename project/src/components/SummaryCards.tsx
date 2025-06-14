import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, DollarSign, Percent, BarChart3 } from 'lucide-react';
import { TradeSummary } from '../types/trade';
import { useTheme } from '../contexts/ThemeContext';

interface SummaryCardsProps {
  summary: TradeSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { isDark } = useTheme();
  
  const cards = [
    {
      title: 'Total Trades',
      value: summary.totalTrades.toString(),
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: isDark ? 'border-blue-800/30' : 'border-blue-200',
    },
    {
      title: 'Win Rate',
      value: `${summary.winRate.toFixed(1)}%`,
      icon: Target,
      color: summary.winRate >= 50 ? 'text-green-400' : 'text-red-400',
      bgColor: summary.winRate >= 50 
        ? (isDark ? 'bg-green-900/20' : 'bg-green-50')
        : (isDark ? 'bg-red-900/20' : 'bg-red-50'),
      borderColor: summary.winRate >= 50 
        ? (isDark ? 'border-green-800/30' : 'border-green-200')
        : (isDark ? 'border-red-800/30' : 'border-red-200'),
    },
    {
      title: 'Net P&L',
      value: `${summary.netPnL >= 0 ? '+' : ''}$${summary.netPnL.toFixed(2)}`,
      icon: DollarSign,
      color: summary.netPnL >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: summary.netPnL >= 0 
        ? (isDark ? 'bg-green-900/20' : 'bg-green-50')
        : (isDark ? 'bg-red-900/20' : 'bg-red-50'),
      borderColor: summary.netPnL >= 0 
        ? (isDark ? 'border-green-800/30' : 'border-green-200')
        : (isDark ? 'border-red-800/30' : 'border-red-200'),
    },
    {
      title: 'Profit Factor',
      value: summary.profitFactor.toFixed(2),
      icon: Percent,
      color: summary.profitFactor >= 1 ? 'text-green-400' : 'text-red-400',
      bgColor: summary.profitFactor >= 1 
        ? (isDark ? 'bg-green-900/20' : 'bg-green-50')
        : (isDark ? 'bg-red-900/20' : 'bg-red-50'),
      borderColor: summary.profitFactor >= 1 
        ? (isDark ? 'border-green-800/30' : 'border-green-200')
        : (isDark ? 'border-red-800/30' : 'border-red-200'),
    },
    {
      title: 'Average Win',
      value: `$${summary.averageWin.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: isDark ? 'border-green-800/30' : 'border-green-200',
    },
    {
      title: 'Average Loss',
      value: `$${summary.averageLoss.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50',
      borderColor: isDark ? 'border-red-800/30' : 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            className={`rounded-lg p-6 border transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            } ${card.bgColor} ${card.borderColor} hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {card.title}
                </p>
                <motion.p 
                  className={`text-2xl font-bold ${card.color}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                >
                  {card.value}
                </motion.p>
              </div>
              <motion.div 
                className={`p-3 rounded-lg ${card.bgColor}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className={`w-6 h-6 ${card.color}`} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}