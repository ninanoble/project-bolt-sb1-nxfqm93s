import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  Calendar, 
  FileText, 
  Settings, 
  BookOpen, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Target,
  LogOut,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/journal' },
    { id: 'reports', label: 'Reports', icon: BarChart2, path: '/reports' },
    { id: 'tradelog', label: 'Trade Log', icon: FileText, path: '/tradelog' },
    { id: 'notebook', label: 'Notebook', icon: BookOpen, path: '/notebook' },
    { id: 'playbook', label: 'Playbook', icon: Target, path: '/playbook' },
    { id: 'dailyjournal', label: 'Daily Journal', icon: Calendar, path: '/dailyjournal' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#000000] border-b border-[#1a1a1a] px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="text-2xl font-bold">
              <span className="text-blue-400">NBS</span>
              <span className="text-white"> Journal</span>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {/* Account Balance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] rounded-lg"
            >
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-medium">$25,000.00</span>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            {/* Settings */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* Logout */}
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex pt-[73px]">
        {/* Sidebar */}
        <motion.nav 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-[#000000] border-r border-[#1a1a1a] transition-all duration-300 ${
            isSidebarExpanded ? 'w-64' : 'w-20'
          }`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <motion.div
                      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <AnimatePresence>
                      {isSidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
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
          className={`flex-1 min-h-[calc(100vh-73px)] overflow-y-auto transition-all duration-300 bg-[#000000] ${
            isSidebarExpanded ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}