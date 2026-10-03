import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { supabase } from './config/supabase'; // Adjust this path if your supabase.js is inside a 'config' folder (e.g., './config/supabase')

// 1. Create the Security Checkpoint (Protected Route)
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active login session when the page first loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for login/logout events in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a loading screen while Supabase checks the keys
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1710] flex items-center justify-center text-lime-400 font-bold">
        Verifying Security Credentials...
      </div>
    );
  }

  // If no session is found, force them back to the login page
  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  // If they are logged in, allow them to see the dashboard
  return children;
};

// 2. Main App Router
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Portfolio />} />
        
        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}