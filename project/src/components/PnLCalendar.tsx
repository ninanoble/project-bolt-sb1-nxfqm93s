import React, { useState } from 'react';
import { format, addMonths, isSameDay } from 'date-fns';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, DollarSign, Clock, Activity } from 'lucide-react';
import { Trade } from '../types/trade';
import { generateCalendarData, CalendarDay, WeeklySummary, MonthlySummary } from '../utils/calendarUtils';

interface PnLCalendarProps {
  trades: Trade[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function PnLCalendar({ trades, onDateSelect, selectedDate }: PnLCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setUTCHours(0, 0, 0, 0);
    setCurrentMonth(prev => addMonths(newDate, -1));
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setUTCHours(0, 0, 0, 0);
    setCurrentMonth(prev => addMonths(newDate, 1));
  };

  // Calculate cumulative P&L for the entire month
  const calculateCumulativePnL = (date: Date, trades: Trade[]) => {
    const filteredTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate <= date;
    });
    return filteredTrades.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0);
  };

  const utcCurrentMonth = new Date(currentMonth);
  utcCurrentMonth.setUTCHours(0, 0, 0, 0);
  const { calendarData, weeklySummaries, monthlySummary } = generateCalendarData(trades, utcCurrentMonth);

  return (
    <div className="bg-black rounded-2xl border border-[#1a1a1a] shadow-2xl overflow-hidden">
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
        <div className="bg-black rounded-xl border border-[#2a2a2a] p-6 mb-8">
          <h4 className="text-lg font-semibold text-white/90 mb-4">Monthly Summary</h4>
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-black rounded-lg p-4 border border-[#2a2a2a]">
               <div className="text-sm text-white/50 mb-1">Net P&L</div>
               <div className={`text-2xl font-bold ${monthlySummary.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                 {monthlySummary.pnl > 0 ? '+' : ''}{monthlySummary.pnl.toFixed(2)}
               </div>
             </div>
             <div className="bg-black rounded-lg p-4 border border-[#2a2a2a]">
               <div className="text-sm text-white/50 mb-1">Total Trades</div>
               <div className="text-2xl font-bold text-white/90">{monthlySummary.trades}</div>
             </div>
             <div className="bg-black rounded-lg p-4 border border-[#2a2a2a]">
               <div className="text-sm text-white/50 mb-1">Win Rate</div>
               <div className="text-2xl font-bold text-white/90">{monthlySummary.winRate.toFixed(1)}%</div>
             </div>
             <div className="bg-black rounded-lg p-4 border border-[#2a2a2a]">
               <div className="text-sm text-white/50 mb-1">Avg Daily P&L</div>
               <div className={`text-2xl font-bold ${monthlySummary.avgDailyPnL > 0 ? 'text-green-400' : 'text-red-400'}`}>
                 {monthlySummary.avgDailyPnL > 0 ? '+' : ''}{monthlySummary.avgDailyPnL.toFixed(2)}
               </div>
             </div>
           </div>
         </div>

         {/* Weekly Summaries */}
         <div className="grid grid-cols-4 gap-4 mb-8">
           {weeklySummaries.map((summary, index) => (
             <div key={index} className="bg-black rounded-xl border border-[#2a2a2a] p-5 hover:border-blue-500/30 transition-all duration-300">
               <h4 className="text-sm font-medium text-white/70 mb-3">Week {summary.week}</h4>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Net P&L</span>
                   <span className={`font-medium ${(summary.pnl || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {(summary.pnl || 0) > 0 ? '+' : ''}{(summary.pnl || 0).toFixed(2)}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Cumulative P&L</span>
                   <span className={`font-medium ${(summary.cumulativePnL || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {(summary.cumulativePnL || 0) > 0 ? '+' : ''}{(summary.cumulativePnL || 0).toFixed(2)}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Max Drawdown</span>
                   <span className="font-medium text-red-400">
                     {(summary.maxDrawdown || 0).toFixed(2)}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Max Profit</span>
                   <span className="font-medium text-green-400">
                     {(summary.maxProfit || 0).toFixed(2)}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Win Rate</span>
                   <span className="font-medium text-white/90">
                     {(summary.winRate || 0).toFixed(1)}%
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Trades</span>
                   <span className="font-medium text-white/90">
                     {summary.trades}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-white/50">Winning Trades</span>
                   <span className="font-medium text-green-400">
                     {summary.winningTrades}
                   </span>
                 </div>
               </div>
             </div>
           ))}
         </div>

        {/* Calendar Grid */}
         <div className="bg-black p-4 rounded-lg">
           <div className="flex justify-between items-center mb-4">
             <button
               onClick={handlePrevMonth}
               className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
             >
               Previous Month
             </button>
             <div className="text-white/50">
               {format(currentMonth, 'MMMM yyyy')}
             </div>
             <button
               onClick={handleNextMonth}
               className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
             >
               Next Month
             </button>
           </div>
           <div className="grid grid-cols-7 gap-2 mb-4">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="text-center text-white/50">
                 {day}
               </div>
             ))}
           </div>
           <div className="grid grid-cols-7 gap-2">
             {calendarData.map(day => {
               const utcDate = new Date(day.date);
               utcDate.setUTCHours(0, 0, 0, 0);
               
               return (
                 <div
                   key={utcDate.toISOString()}
                   onClick={() => onDateSelect(new Date(utcDate))}
                   className={`
                     relative p-2 rounded-md transition-all duration-200 cursor-pointer
                     bg-black
                     ${selectedDate && selectedDate.toISOString().split('T')[0] === utcDate.toISOString().split('T')[0] ? 'border-2 border-gray-800' : ''}
                     ${day.isMarketHoliday ? 'bg-red-500/20' : ''}
                     ${day.netPnL > 0 ? 'bg-green-500/20' : day.netPnL < 0 ? 'bg-red-500/20' : ''}
                     h-[60px] w-full
                     border border-gray-800
                     hover:bg-gray-700/20
                     flex items-center
                   `}
                 >
                   <div className="flex flex-col items-center justify-center">
                     <div className="flex items-center justify-center">
                       <div className="text-sm font-medium text-white/90">
                         {utcDate.getUTCDate()}
                       </div>
                     </div>
                     {day.tradeCount > 0 && (
                       <div className="mt-0.5">
                         <div className={`text-xs font-medium ${day.netPnL > 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {day.netPnL > 0 ? '+' : ''}{day.netPnL.toFixed(2)}
                         </div>
                         <div className="text-[10px] text-white/70 mt-0.25">
                           {day.tradeCount} {day.tradeCount === 1 ? 'trade' : 'trades'}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
         </div>
      </div>
    </div>
  );
}