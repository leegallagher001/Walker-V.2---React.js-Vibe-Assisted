
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Journal from './pages/Journal';
import Habit from './pages/Habit';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a global spinner
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route 
          path="/planner" 
          element={<ProtectedRoute><Planner /></ProtectedRoute>} 
        />
        <Route 
          path="/journal" 
          element={<ProtectedRoute><Journal /></ProtectedRoute>} 
        />
        <Route 
          path="/habit" 
          element={<ProtectedRoute><Habit /></ProtectedRoute>} 
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
