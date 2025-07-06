import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from "./supabaseClient"; // Ensure `supabaseClient.js` exists in `src/`

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    };
    checkSession();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth onAuth={() => setIsAuthenticated(true)} />} />
        <Route path="/dashboard" element={isAuthenticated ? (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Dashboard />
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setIsAuthenticated(false);
                }}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        ) : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
