import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage';
import AuthPage from './components/Auth/AuthPage';
import DocumentUploadPage from './components/Upload/DocumentUploadPage';
import HeroSection from './components/LandingPage/HeroSection';
import AIAgentPage from './components/AIAgent/AIAgentPage';




const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        // STAY ON LANDING - don't redirect
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
          setCurrentPage('landing'); // Go back to landing after login
        } else {
          setUser(null);
          setCurrentPage('landing');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserAuth = (userData) => {
    setUser(userData);
    setCurrentPage('landing'); // Back to landing after successful auth
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-manu-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manu-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Page Routing Logic
  switch (currentPage) {
    case 'auth':
      return <AuthPage onUserAuth={handleUserAuth} onPageChange={handlePageChange} />;

    case 'upload':
      // Only show upload page if user is logged in
      return user ? (
        <DocumentUploadPage
          user={user}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
        />
      ) : (
        // Redirect to auth if not logged in
        <AuthPage onUserAuth={handleUserAuth} onPageChange={handlePageChange} />
      );

    case 'ai-agent':
      // Integrated AI Agent Page
      return user ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          {/* Render the AI Agent Page */}
          <AIAgentPage user={user} onPageChange={handlePageChange} onLogout={handleLogout} />
        </div>
      ) : (
        <AuthPage onUserAuth={handleUserAuth} onPageChange={handlePageChange} />
      );

    default:
      // Default to landing page
      return (
        <LandingPage
          onPageChange={handlePageChange}
          user={user}
          onLogout={handleLogout}
        />
      );
  }
}

export default App;
