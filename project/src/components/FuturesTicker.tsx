import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface FuturesAsset {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function FuturesTicker() {
  const { isDark } = useTheme();
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let animationFrame: number;
    let position = 0;
    const speed = 1; // Adjust speed as needed

    const animate = () => {
      position -= speed;
      if (position <= -ticker.scrollWidth / 2) {
        position = 0;
      }
      ticker.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`overflow-hidden w-full ${
      isDark ? 'bg-black/50' : 'bg-white/50'
    }`}>
      <div 
        ref={tickerRef}
        className="flex whitespace-nowrap py-4"
        style={{ willChange: 'transform' }}
      >
        {/* Duplicate the content to create seamless loop */}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex space-x-8">
            <TickerItem symbol="ES" price="4,567.25" change="+1.25%" isPositive={true} />
            <TickerItem symbol="NQ" price="15,234.50" change="-0.75%" isPositive={false} />
            <TickerItem symbol="YM" price="34,567.00" change="+0.50%" isPositive={true} />
            <TickerItem symbol="RTY" price="2,345.75" change="-1.00%" isPositive={false} />
            <TickerItem symbol="CL" price="78.45" change="+2.15%" isPositive={true} />
            <TickerItem symbol="GC" price="1,987.30" change="-0.25%" isPositive={false} />
            <TickerItem symbol="SI" price="23.45" change="+0.75%" isPositive={true} />
            <TickerItem symbol="PL" price="987.65" change="-0.50%" isPositive={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TickerItem({ symbol, price, change, isPositive }: { 
  symbol: string; 
  price: string; 
  change: string; 
  isPositive: boolean;
}) {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex items-center space-x-4 px-4 ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    }`}>
      <span className="font-semibold">{symbol}</span>
      <span>{price}</span>
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {change}
      </span>
    </div>
  );
} 