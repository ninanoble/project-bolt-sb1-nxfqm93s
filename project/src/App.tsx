import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LandingPage } from './components/LandingPage';
import { JournalDashboard } from './components/JournalDashboard';
import { ReportsPage } from './components/ReportsPage';
import { Layout } from './components/Layout';

// Add global styles
const globalStyles = {
  backgroundColor: '#000000',
  minHeight: '100vh',
  width: '100%',
  margin: 0,
  padding: 0,
};

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={globalStyles}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div style={globalStyles}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/journal" replace /> : <LandingPage />} />
        <Route
          path="/journal"
          element={
            <PrivateRoute>
              <Layout>
                <JournalDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tradelog"
          element={
            <PrivateRoute>
              <Layout>
                <JournalDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notebook"
          element={
            <PrivateRoute>
              <Layout>
                <JournalDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/playbook"
          element={
            <PrivateRoute>
              <Layout>
                <JournalDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dailyjournal"
          element={
            <PrivateRoute>
              <Layout>
                <JournalDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <div style={globalStyles}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </div>
  );
}