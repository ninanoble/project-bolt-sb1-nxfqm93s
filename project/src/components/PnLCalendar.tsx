import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Trade } from '../types/trade';

interface PnLCalendarProps {
  trades: Trade[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function PnLCalendar({ trades = [], onDateSelect, selectedDate }: PnLCalendarProps) {
  const { isDark } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate the start and end of the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Get all days in the current month view
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  // Calculate daily PnL and trade count
  const dailyStats = daysInMonth.map(date => {
    const dayTrades = trades.filter(trade => isSameDay(new Date(trade.date), date));
    const pnl = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    return {
      date,
      pnl,
      tradeCount: dayTrades.length,
      isCurrentMonth: isSameMonth(date, currentMonth)
    };
  });

  // Calculate monthly total
  const monthlyTotal = dailyStats
    .filter(day => day.isCurrentMonth)
    .reduce((sum, day) => sum + day.pnl, 0);

  // Calculate weekly summaries
  const weeklySummaries = dailyStats
    .filter(day => day.isCurrentMonth)
    .reduce((weeks, day) => {
      const weekNumber = Math.floor((day.date.getDate() - 1) / 7);
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = { pnl: 0, tradeCount: 0 };
      }
      weeks[weekNumber].pnl += day.pnl;
      weeks[weekNumber].tradeCount += day.tradeCount;
      return weeks;
    }, Array(5).fill(null).map(() => ({ pnl: 0, tradeCount: 0 })));

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Month Navigation and Total */}
      <div className={`p-4 rounded-lg ${
        isDark ? 'bg-gray-800/50' : 'bg-white'
      } border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousMonth}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className={`w-5 h-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </button>
            <div className="flex items-center gap-2">
              <CalendarIcon className={`w-5 h-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
            </div>
            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className={`w-5 h-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </button>
          </div>
          <div className={`text-2xl font-bold ${
            monthlyTotal > 0
              ? isDark ? 'text-green-400' : 'text-green-600'
              : monthlyTotal < 0
                ? isDark ? 'text-red-400' : 'text-red-600'
                : isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            ${monthlyTotal.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        {/* Main Calendar */}
        <div className={`flex-1 p-4 rounded-lg ${
          isDark ? 'bg-gray-800/50' : 'bg-white'
        } border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } shadow-sm`}>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className={`text-center font-medium py-2 border-b ${
                  isDark ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'
                }`}
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {dailyStats.map(({ date, pnl, tradeCount, isCurrentMonth }) => {
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isProfit = pnl > 0;
              const isLoss = pnl < 0;
              const hasTrades = tradeCount > 0;

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => onDateSelect(date)}
                  className={`relative min-h-[100px] p-2 rounded-lg transition-all border ${
                    !isCurrentMonth
                      ? isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'
                      : isSelected
                        ? isDark ? 'bg-blue-600 border-blue-500' : 'bg-blue-500 border-blue-400'
                        : hasTrades
                          ? isProfit
                            ? isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'
                            : isLoss
                              ? isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
                              : isDark ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-100 border-gray-200'
                          : isDark ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center h-full justify-between">
                    {/* Date number */}
                    <span className={`text-xs font-medium ${
                      !isCurrentMonth
                        ? isDark ? 'text-gray-600' : 'text-gray-400'
                        : isSelected
                          ? 'text-white'
                          : isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {format(date, 'd')}
                    </span>

                    {/* PnL amount */}
                    {hasTrades && (
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${
                          isSelected
                            ? 'text-white'
                            : isProfit
                              ? isDark ? 'text-green-400' : 'text-green-600'
                              : isLoss
                                ? isDark ? 'text-red-400' : 'text-red-600'
                                : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          ${Math.abs(pnl).toLocaleString()}
                        </span>
                        <span className={`text-xs ${
                          isSelected
                            ? 'text-white/80'
                            : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Summaries */}
        <div className={`w-64 p-4 rounded-lg ${
          isDark ? 'bg-gray-800/50' : 'bg-white'
        } border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Weekly Breakdown
          </h3>
          
          <div className="space-y-3">
            {weeklySummaries.map((week, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                isDark ? 'bg-gray-700/30' : 'bg-gray-50'
              }`}>
                <div className={`text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Week {index + 1}
                </div>
                <div className={`text-lg font-bold ${
                  week.pnl > 0
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : week.pnl < 0
                      ? isDark ? 'text-red-400' : 'text-red-600'
                      : isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ${week.pnl.toLocaleString()}
                </div>
                <div className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {week.tradeCount} {week.tradeCount === 1 ? 'trade' : 'trades'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 