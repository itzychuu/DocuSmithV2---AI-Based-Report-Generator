import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ReplaceContent from './pages/Features/ReplaceContent';
import ReportGenerator from './pages/Features/ReportGenerator';
import ProposalDrafter from './pages/Features/ProposalDrafter';
import Community from './pages/Community/Community';
import Profile from './pages/Profile/Profile';
import AboutUs from './pages/Static/AboutUs';
import ContactUs from './pages/Static/ContactUs';
import AuthPage from './pages/Auth/AuthPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/replace-content" 
          element={
            <PrivateRoute>
              <ReplaceContent />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/generate-content" 
          element={
            <PrivateRoute>
              <ReportGenerator />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/proposal-writing" 
          element={
            <PrivateRoute>
              <ProposalDrafter />
            </PrivateRoute>
          } 
        />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
