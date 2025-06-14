import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { ViewMode } from '../types/trade';
import { useTheme } from '../contexts/ThemeContext';

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
}

export function DateNavigation({ selectedDate, onDateChange, viewMode }: DateNavigationProps) {
  const { isDark } = useTheme();
  
  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    
    switch (viewMode) {
      case 'daily':
        newDate = direction === 'prev' 
          ? subDays(selectedDate, 1) 
          : addDays(selectedDate, 1);
        break;
      case 'weekly':
        newDate = direction === 'prev' 
          ? subWeeks(selectedDate, 1) 
          : addWeeks(selectedDate, 1);
        break;
      case 'monthly':
        newDate = direction === 'prev' 
          ? subMonths(selectedDate, 1) 
          : addMonths(selectedDate, 1);
        break;
      default:
        return;
    }
    
    onDateChange(newDate);
  };

  const getDateLabel = () => {
    switch (viewMode) {
      case 'daily':
        return format(selectedDate, 'EEEE, MMMM dd, yyyy');
      case 'weekly':
        return `Week of ${format(selectedDate, 'MMMM dd, yyyy')}`;
      case 'monthly':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between rounded-lg p-4 mb-6 transition-colors duration-300 ${
        isDark 
          ? 'bg-black border border-gray-800' 
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={() => navigateDate('prev')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <h2 className={`text-lg font-semibold min-w-0 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {getDateLabel()}
        </h2>
        
        <motion.button
          onClick={() => navigateDate('next')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      <motion.button
        onClick={goToToday}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
          isDark 
            ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span>Today</span>
      </motion.button>
    </motion.div>
  );
}