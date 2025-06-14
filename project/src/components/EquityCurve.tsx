import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Trade } from '../types/trade';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EquityCurveProps {
  trades: Trade[];
  accountSize: number;
}

export default function EquityCurve({ trades, accountSize }: EquityCurveProps) {
  const { equityPoints, totalReturn, currentEquity } = useMemo(() => {
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate equity points
    let runningEquity = accountSize;
    const points = sortedTrades.map(trade => {
      runningEquity += trade.pnl || 0;
      return {
        date: new Date(trade.date),
        equity: runningEquity
      };
    });

    // Add initial point
    points.unshift({
      date: new Date(sortedTrades[0]?.date || new Date()),
      equity: accountSize
    });

    const finalEquity = points[points.length - 1]?.equity || accountSize;
    const totalReturn = ((finalEquity - accountSize) / accountSize) * 100;

    return {
      equityPoints: points,
      totalReturn,
      currentEquity: finalEquity
    };
  }, [trades, accountSize]);

  const data = {
    labels: equityPoints.map(point => point.date.toLocaleDateString()),
    datasets: [
      {
        label: 'Equity',
        data: equityPoints.map(point => point.equity),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: 'rgb(34, 197, 94)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const returnValue = ((value - accountSize) / accountSize) * 100;
            return [
              `Equity: $${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Return: ${returnValue.toFixed(2)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 0
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          callback: (value: any) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Equity Curve</h2>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Performance</span>
        </div>
      </div>
      
      <div className="h-[400px] mb-6 relative">
        <Line data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <ArrowUpRight className={`w-4 h-4 mr-2 ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            Total Return
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn.toFixed(2)}%
            </span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
            Current Equity
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold">
              {((currentEquity - accountSize) / accountSize * 100).toFixed(2)}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}