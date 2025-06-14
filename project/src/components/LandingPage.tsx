// Test comment
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight, LayoutDashboard, BarChart2, BookOpen } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { useNavigate } from 'react-router-dom';
import { PaymentModal } from './PaymentModal';
import { TraderNetwork } from './TraderNetwork';
import { StatsTicker } from './StatsTicker';
import { Testimonials } from './Testimonials';
import { JournalPreview } from './JournalPreview';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const featureCard = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  whileHover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export function LandingPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/journal');
      } else {
        await signup(email, password, name, subscribeNewsletter);
        navigate('/journal');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      <TraderNetwork />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg border-b border-white/20 py-4"
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-12"
            >
              <a href="#" className="text-3xl font-bold text-white hover:text-blue-500 transition-colors">
                <span className="text-blue-500">NBS</span> Journal
              </a>
              <div className="hidden md:flex items-center space-x-8">
                <a onClick={() => setShowOverview(!showOverview)} className="text-white/90 hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-lg font-medium">
                  <LayoutDashboard className="w-6 h-6" />
                  Overview
                </a>
                <a onClick={() => setShowAnalytics(!showAnalytics)} className="text-white/90 hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-lg font-medium">
                  <BarChart2 className="w-6 h-6" />
                  Analytics
                </a>
                <a href="#features" className="text-white/90 hover:text-white transition-colors text-lg font-medium">Features</a>
                <a href="#pricing" className="text-white/90 hover:text-white transition-colors text-lg font-medium">Pricing</a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(true);
                  setShowAuthModal(true);
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] text-lg font-medium"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] text-lg font-medium"
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">Elevate</span> <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Your Trading Journey</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/80 mb-8"
            >
              Join our network of traders and transform your trading performance with our comprehensive journaling platform.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                Start Trading Smarter <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journal Preview */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Your Trading Command Center</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Experience our intuitive interface designed specifically for futures traders. Track your trades, analyze performance, and make data-driven decisions.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <JournalPreview />
          </motion.div>
        </div>
      </section>

      {/* Stats Ticker */}
      <StatsTicker />

      {/* Overview Section */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black p-8 rounded-2xl w-full max-w-4xl border border-gray-800 relative font-sans text-white"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOverview(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg"
              >
                ✕
              </motion.button>
              <h2 className="text-4xl font-bold text-center mb-16">
                Your Trading Overview
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-center"
              >
                <p className="text-xl mb-4">
                  NBS Journal is your all-in-one platform to master your trading journey. We provide intuitive tools for detailed trade entry, comprehensive performance analytics, and emotional tracking. Develop and refine your strategies with powerful backtesting, gain insights through visual analytics, and manage your risk effectively to achieve consistent profitability.
                </p>
                <p className="text-lg">
                  This overview provides a quick snapshot of your essential trading metrics and highlights the core functionalities of NBS Journal, helping you stay on top of your performance.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Section */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black p-8 rounded-2xl w-full max-w-4xl border border-gray-800 relative font-sans text-white"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAnalytics(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg"
              >
                ✕
              </motion.button>
              <h2 className="text-4xl font-bold text-center mb-16">
                Comprehensive Analytics
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-center"
              >
                <p className="text-xl mb-4">
                  Gain deep insights into your trading performance with our powerful analytics suite. Track every aspect of your trades, including profit/loss, win rate, risk-reward ratios, and detailed breakdown by instrument, strategy, and time of day.
                </p>
                <p className="text-lg mb-4">
                  Our advanced charts and customizable reports help you visualize your progress, identify strengths and weaknesses, and make data-driven decisions to optimize your strategies.
                </p>
                <p className="text-lg">
                  Access detailed performance metrics like equity curves, drawdown analysis, profit factor, and much more, all designed to help you continuously improve and achieve consistent results.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black p-8 rounded-2xl w-full max-w-4xl border border-gray-800 relative font-sans text-white"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg"
              >
                ✕
              </motion.button>
              
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-center mb-8">
                  See NBS Journal in Action
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <p className="text-white/60">Demo Video Coming Soon</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">What You'll See:</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-400">•</span>
                        <span>Real-time trade entry and analysis workflow</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-400">•</span>
                        <span>Performance analytics dashboard with key metrics</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-400">•</span>
                        <span>Risk management tools and position sizing calculator</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-400">•</span>
                        <span>Strategy development and backtesting interface</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-400">•</span>
                        <span>Interactive charts and visual analytics</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowDemo(false);
                      setIsLogin(false);
                      setShowAuthModal(true);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  >
                    Start Your Free Trial
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section id="features" className="py-12 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">
            Features That Will Transform Your Trading
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Trade Entry & Analysis</h3>
              <p className="text-white/70">
                Record every trade with precision - entry/exit points, position size, market conditions, and your thought process behind each decision.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
              <p className="text-white/70">
                Track win rates, profit factors, average win/loss, drawdowns, and other key metrics to measure your trading success.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Emotional Tracking</h3>
              <p className="text-white/70">
                Monitor your emotional state during trades to identify patterns and improve your trading psychology.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Risk Management</h3>
              <p className="text-white/70">
                Calculate position sizes, track risk per trade, and maintain proper risk-reward ratios for consistent performance.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Strategy Development</h3>
              <p className="text-white/70">
                Test and refine your trading strategies with detailed backtesting and performance analysis tools.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Visual Analytics</h3>
              <p className="text-white/70">
                Generate insightful charts and graphs to visualize your trading performance and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Pricing Section */}
      <section id="pricing" className="py-12 relative bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-8"
          >
            Flexible Pricing for Every Trader
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Basic</h3>
              <p className="text-5xl font-extrabold mb-2">$3<span className="text-xl font-normal">/month</span></p>
              <p className="text-white/70 mb-8">Perfect for beginners</p>
              <ul className="text-left space-y-2 mb-8 text-white/80">
                <li>✔ Trade Entry & Analysis</li>
                <li>✔ Basic Performance Analytics</li>
                <li>✔ Emotional Tracking</li>
                <li>✔ Standard Support</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started - Basic
              </motion.button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 border border-white/10 text-white text-center shadow-lg transform scale-105"
            >
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-5xl font-extrabold mb-2">$15<span className="text-xl font-normal">/month</span></p>
              <p className="text-white/90 mb-8">For serious traders</p>
              <ul className="text-left space-y-2 mb-8">
                <li>✔ All Basic Features</li>
                <li>✔ Advanced Performance Analytics</li>
                <li>✔ Risk Management Tools</li>
                <li>✔ Daily Live Trading Sessions</li>
                <li>✔ Priority Support</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started - Pro
              </motion.button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <h3 className="text-2xl font-bold text-green-400 mb-4">Premium</h3>
              <p className="text-5xl font-extrabold mb-2">$500<span className="text-xl font-normal">/year</span></p>
              <p className="text-white/70 mb-8">Personalized guidance</p>
              <ul className="text-left space-y-2 mb-8 text-white/80">
                <li>✔ All Pro Features</li>
                <li>✔ 1-on-1 Mentorship Sessions</li>
                <li>✔ Custom Strategy Development</li>
                <li>✔ Exclusive Community Access</li>
                <li>✔ Dedicated Account Manager</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                Contact for Premium
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of traders who are already using NBS Journal to improve their performance.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              Start Your Journey Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 relative bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-8"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Current Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Available Now</h3>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold mb-2">What features are currently available?</h4>
                <p className="text-white/70">
                  • Trade Entry & Analysis<br />
                  • Basic Performance Analytics<br />
                  • Emotional Tracking<br />
                  • Risk Management Tools<br />
                  • Mobile Responsive Design
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold mb-2">How secure is my trading data?</h4>
                <p className="text-white/70">
                  Your data is encrypted and stored securely. We use industry-standard security measures to protect your information and trading history.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold mb-2">Can I try before I buy?</h4>
                <p className="text-white/70">
                  Yes! We offer a 7-day free trial with full access to all current features. No credit card required to start.
                </p>
              </div>
            </div>

            {/* Upcoming Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">Coming Soon</h3>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold mb-2">What features are in development?</h4>
                <p className="text-white/70">
                  • AI-Powered Trade Analysis<br />
                  • Advanced Performance Analytics<br />
                  • Broker Integration<br />
                  • Mobile App<br />
                  • Community Features
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold mb-2">Will there be a mobile app?</h4>
                <p className="text-white/70">
                  Yes! We're developing native mobile apps for iOS and Android. Early access will be available to Pro and Premium subscribers.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold mb-2">What about broker integration?</h4>
                <p className="text-white/70">
                  We're working on direct integration with major futures brokers. This will allow automatic trade import and real-time P&L tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60">
              Have more questions? <a href="#" className="text-blue-400 hover:text-blue-300">Contact our support team</a>
            </p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-full max-w-md border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="newsletter" className="text-sm text-white/80">
                        Subscribe to NBS Journal Newsletter
                      </label>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                    }}
                    className="text-white/80 hover:text-white text-sm"
                  >
                    {isLogin ? 'Need an account?' : 'Already have an account?'}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </motion.button>
                </div>
              </form>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with About and Socials */}
      <footer className="py-8 bg-black/50 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* About Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4">About NBS Journal</h3>
              <p className="text-white/70 mb-4">
                NBS Journal is a comprehensive trading journal platform designed specifically for futures traders. 
                Our mission is to help traders improve their performance through detailed analysis, 
                emotional tracking, and data-driven insights.
              </p>
              <p className="text-white/70">
                Built by traders, for traders. We understand the challenges of the market and 
                provide the tools you need to succeed.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-6">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} NBS Journal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 