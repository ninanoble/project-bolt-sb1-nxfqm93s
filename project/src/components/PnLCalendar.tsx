import React, { useState } from 'react';
import { format, addMonths, isSameDay } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Trade } from '../types/trade';

interface CalendarDay {
  date: Date;
  netPnL: number;
  tradeCount: number;
  trades: Trade[];
}

interface WeeklySummary {
  week: number;
  pnl: number;
  trades: number;
}

interface PnLCalendarProps {
  trades: Trade[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function PnLCalendar({ trades, onDateSelect, selectedDate }: PnLCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const generateCalendarData = () => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarData: CalendarDay[] = [];
    const weeklySummaries: WeeklySummary[] = [];
    let currentWeek = 1;
    let weekPnL = 0;
    let weekTrades = 0;
    let monthlyPnL = 0;
    let monthlyTrades = 0;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarData.push({
        date: new Date(year, month, -i),
        netPnL: 0,
        tradeCount: 0,
        trades: []
      });
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTrades = trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate.getDate() === day && 
               tradeDate.getMonth() === month && 
               tradeDate.getFullYear() === year;
      });

      const netPnL = dayTrades.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0);
      weekPnL += netPnL;
      weekTrades += dayTrades.length;
      monthlyPnL += netPnL;
      monthlyTrades += dayTrades.length;
      
      calendarData.push({
        date,
        netPnL,
        tradeCount: dayTrades.length,
        trades: dayTrades
      });

      // If it's the end of the week or the last day of the month, add the weekly summary
      if (date.getDay() === 6 || day === daysInMonth) {
        weeklySummaries.push({
          week: currentWeek,
          pnl: weekPnL,
          trades: weekTrades
        });
        currentWeek++;
        weekPnL = 0;
        weekTrades = 0;
      }
    }

    return { calendarData, weeklySummaries, monthlyPnL, monthlyTrades };
  };

  const { calendarData, weeklySummaries, monthlyPnL, monthlyTrades } = generateCalendarData();

  return (
    <div className="bg-[#000000] rounded-2xl border border-[#1a1a1a] shadow-2xl overflow-hidden">
      <div className="p-8">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PnL Calendar
          </h3>
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white/70 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold text-white/90">
                {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white/70 hover:text-white transition-all duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>

        {/* Monthly Summary */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 mb-8">
          <h4 className="text-lg font-semibold text-white/90 mb-4">Monthly Summary</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#000000] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-sm text-white/50 mb-1">Net P&L</div>
              <div className={`text-2xl font-bold ${monthlyPnL > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {monthlyPnL > 0 ? '+' : ''}{monthlyPnL.toFixed(2)}
              </div>
                      </div>
            <div className="bg-[#000000] rounded-lg p-4 border border-[#2a2a2a]">
              <div className="text-sm text-white/50 mb-1">Total Trades</div>
              <div className="text-2xl font-bold text-white/90">{monthlyTrades}</div>
                  </div>
          </div>
        </div>

        {/* Weekly Summaries */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {weeklySummaries.map((summary, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5 hover:border-blue-500/30 transition-all duration-300">
              <h4 className="text-sm font-medium text-white/70 mb-3">Week {summary.week}</h4>
          <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Net P&L</span>
                  <span className={`font-medium ${summary.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {summary.pnl > 0 ? '+' : ''}{summary.pnl.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Trades</span>
                  <span className="text-white/70">{summary.trades}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
          <div className="grid grid-cols-7 gap-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-white/50 py-2 bg-[#000000] rounded-lg">
                {day}
              </div>
            ))}
            {calendarData.map(day => (
              <button
                key={day.date.toISOString()}
                onClick={() => onDateSelect(day.date)}
                className={`
                  relative p-3 rounded-lg border transition-all duration-200
                  ${selectedDate && isSameDay(day.date, selectedDate) 
                    ? 'border-blue-500 bg-[#1a1a1a] ring-2 ring-blue-500/50' 
                    : 'border-[#2a2a2a] hover:border-blue-500/30 hover:bg-[#1a1a1a]'}
                  ${day.date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500/50' : ''}
                  ${day.netPnL > 0 ? 'bg-green-500/10' : day.netPnL < 0 ? 'bg-red-500/10' : 'bg-[#000000]'}
                  min-h-[120px] w-full
                `}
              >
                <div className="text-sm font-medium text-white/70">
                  {day.date.getDate()}
                </div>
                {day.tradeCount > 0 && (
                  <div className="mt-2">
                    <div className={`text-sm font-medium ${day.netPnL > 0 ? 'text-green-400' : day.netPnL < 0 ? 'text-red-400' : 'text-white/70'}`}>
                      {day.netPnL > 0 ? '+' : ''}{day.netPnL.toFixed(2)}
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      {day.tradeCount} {day.tradeCount === 1 ? 'trade' : 'trades'}
                    </div>
                    <div className="mt-2 space-y-1 max-h-[60px] overflow-y-auto">
                      {day.trades.map((trade) => (
                        <div
                          key={trade.id}
                          className={`text-xs p-1 rounded ${
                            trade.pnl && trade.pnl > 0
                              ? 'bg-green-500/20 text-green-400'
                              : trade.pnl && trade.pnl < 0
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          <div className="font-medium truncate">{trade.symbol}</div>
                          <div className="truncate">
                            {trade.pnl && trade.pnl > 0 ? '+' : ''}
                            {trade.pnl?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 