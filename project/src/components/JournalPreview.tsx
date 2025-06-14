import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, FileText, Settings, TrendingUp } from 'lucide-react';

export function JournalPreview() {
  return (
    <div className="relative w-full max-w-5xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Mock Journal Interface */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Trading Journal</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              New Trade
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 text-white/70 mb-4">
                <Calendar className="w-5 h-5" />
                <span>Today's Trades</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded text-sm">
                  <div className="text-green-400">+$1,250</div>
                  <div className="text-white/50">ES - Long</div>
                </div>
                <div className="p-2 bg-white/5 rounded text-sm">
                  <div className="text-red-400">-$450</div>
                  <div className="text-white/50">NQ - Short</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 text-white/70 mb-4">
                <TrendingUp className="w-5 h-5" />
                <span>Performance</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Win Rate</span>
                  <span className="text-white">68%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Avg. Win</span>
                  <span className="text-green-400">$850</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Avg. Loss</span>
                  <span className="text-red-400">$320</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Journal Area */}
          <div className="col-span-9">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Trades</h3>
                <div className="flex space-x-2">
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <BarChart2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Trade List */}
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400">+$1,250</span>
                      <span className="text-white/70">ES</span>
                    </div>
                    <span className="text-white/50 text-sm">2 hours ago</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Long entry at 4,250. Strong support level with increasing volume. Target reached at 4,275.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-red-400">-$450</span>
                      <span className="text-white/70">NQ</span>
                    </div>
                    <span className="text-white/50 text-sm">4 hours ago</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Short entry at 15,200. Break of key support level. Stopped out at 15,250.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 