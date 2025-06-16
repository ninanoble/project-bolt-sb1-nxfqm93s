import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, FileText, Settings, TrendingUp } from 'lucide-react';

export function JournalPreview() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-5xl mx-auto bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-black" />
      <div className="relative p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <span className="text-3xl font-bold text-blue-500">NBS</span>
            <span className="text-3xl font-bold text-white">Journal</span>
          </motion.h2>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              New Trade
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-black rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors duration-300"
            >
              <div className="flex items-center space-x-3 text-white/80 mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Today's Trades</span>
              </div>
              <div className="space-y-3">
                <div className="bg-black rounded-lg border border-white/5 hover:border-green-500/30 transition-colors">
                  <div className="text-green-400 font-medium">+$1,250</div>
                  <div className="text-white/60 text-sm">ES - Long</div>
                </div>
                <div className="bg-black rounded-lg border border-white/5 hover:border-red-500/30 transition-colors">
                  <div className="text-red-400 font-medium">-$450</div>
                  <div className="text-white/60 text-sm">NQ - Short</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-black rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors duration-300"
            >
              <div className="flex items-center space-x-3 text-white/80 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Performance</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-2 bg-black rounded-lg">
                  <span className="text-white/60">Win Rate</span>
                  <span className="text-white font-medium">68%</span>
                </div>
                <div className="flex justify-between text-sm p-2 bg-black rounded-lg">
                  <span className="text-white/60">Avg. Win</span>
                  <span className="text-green-400 font-medium">$850</span>
                </div>
                <div className="flex justify-between text-sm p-2 bg-black rounded-lg">
                  <span className="text-white/60">Avg. Loss</span>
                  <span className="text-red-400 font-medium">$320</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Journal Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-9"
          >
            <div className="bg-black rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Trades</h3>
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <BarChart2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Trade List */}
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-black rounded-lg border border-white/5 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-medium">+$1,250</span>
                      <span className="text-white/70">ES</span>
                    </div>
                    <span className="text-white/50 text-sm">2 hours ago</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Long entry at 4,250. Strong support level with increasing momentum. Target reached at 4,275
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-black rounded-lg border border-white/5 hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-red-400 font-medium">-$450</span>
                      <span className="text-white/70">NQ</span>
                    </div>
                    <span className="text-white/50 text-sm">4 hours ago</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Short entry at 15,200. Break of key support level. Stopped out at 15,250.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
