import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Test from './pages/Test';
import Results from './pages/Results';
import Progress from './pages/Progress';
import Forum from './pages/Forum';
import FAQ from './pages/FAQ';

// Component to handle root route redirection
const RootRedirect = () => {
  const { state } = useApp();
  
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return <Navigate to={state.user ? "/dashboard" : "/auth"} replace />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { state } = useApp();
  
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (state.user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/test" element={
        <ProtectedRoute>
          <Test />
        </ProtectedRoute>
      } />
      
      <Route path="/results" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />
      
      <Route path="/progress" element={
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      } />
      
      <Route path="/forum" element={
        <ProtectedRoute>
          <Forum />
        </ProtectedRoute>
      } />
      
      <Route path="/faq" element={
        <ProtectedRoute>
          <FAQ />
        </ProtectedRoute>
      } />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;