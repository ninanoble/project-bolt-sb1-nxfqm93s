import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, TrendingUp, Settings, BookOpen, Sun, Moon } from 'lucide-react';
import { ViewMode } from '../types/trade';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function Layout({ children, viewMode, onViewModeChange }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  
  const navItems = [
    { id: 'daily' as ViewMode, label: 'Daily', icon: Calendar },
    { id: 'weekly' as ViewMode, label: 'Weekly', icon: BarChart3 },
    { id: 'monthly' as ViewMode, label: 'Monthly', icon: TrendingUp },
    { id: 'tradelog' as ViewMode, label: 'Trade Log', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card px-6 py-4 transition-colors duration-300"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div 
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </motion.div>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.nav 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)] transition-colors duration-300"
        >
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = viewMode === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onViewModeChange(item.id)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <motion.div
                      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}