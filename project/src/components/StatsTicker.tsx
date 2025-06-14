import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart2, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: '500+', label: 'Active Traders' },
  { icon: TrendingUp, value: '$250K+', label: 'Total Profits Tracked' },
  { icon: BarChart2, value: '75%', label: 'Success Rate' },
  { icon: Clock, value: '24/7', label: 'Real-time Analytics' }
];

export function StatsTicker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-black/30 backdrop-blur-md border-y border-white/10 py-4"
    >
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <stat.icon className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 