import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

// Helper functions for generating data
const generatePriceData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    x: i * 20,
    y: 100 + Math.sin(i * 0.5) * 50 + Math.random() * 20
  }));
};

export function AnimatedBackground() {
  const { isDark } = useTheme();
  const priceData = generatePriceData();

  return (
    <div className="fixed inset-0 bg-black">
      {/* Top Navigation Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b border-white/10 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium">NBS Journal</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium">Dashboard</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium">Trades</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium">Analytics</a>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="fixed inset-0 pt-16 pl-20">
        {/* Main Price Chart */}
        <motion.div
          className="absolute top-[10%] left-[10%] w-[40%] h-[30%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <svg width="100%" height="100%" className="border border-white/10 rounded-lg">
            <motion.path
              d={priceData.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  priceData.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
                  priceData.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y + 20}`).join(' '),
                  priceData.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
                ]
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </svg>
        </motion.div>

        {/* Volume Chart */}
        <motion.div
          className="absolute top-[45%] left-[10%] w-[40%] h-[15%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <svg width="100%" height="100%" className="border border-white/10 rounded-lg">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.rect
                key={i}
                x={i * 30}
                y={0}
                width={20}
                height={Math.random() * 100}
                fill="rgb(59, 130, 246)"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: Math.random() * 100,
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Moving Average Lines */}
        <motion.div
          className="absolute top-[10%] right-[10%] w-[40%] h-[30%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <svg width="100%" height="100%" className="border border-white/10 rounded-lg">
            <motion.path
              d="M 0 50 L 100 100 L 200 25 L 300 75 L 400 50 L 500 100 L 600 25"
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  "M 0 50 L 100 100 L 200 25 L 300 75 L 400 50 L 500 100 L 600 25",
                  "M 0 75 L 100 50 L 200 100 L 300 25 L 400 75 L 500 50 L 600 100",
                  "M 0 50 L 100 100 L 200 25 L 300 75 L 400 50 L 500 100 L 600 25"
                ]
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </svg>
        </motion.div>

        {/* Floating Elements */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" className="opacity-5">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  );
} 