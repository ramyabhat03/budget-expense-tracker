import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Transactions from './pages/Transactions';
import AddExpense from './pages/AddExpense';
import Navbar from './components/Navbar';

// Check if token exists
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Protect routes
const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Wrapper for layout with navbar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container mt-4">{children}</div>
    </>
  );
};

const AppRoutes = () => (
  <AppLayout>
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/budget" element={<RequireAuth><Budget /></RequireAuth>} />
      <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
      <Route path="/add-expense" element={<RequireAuth><AddExpense /></RequireAuth>} />

      {/* Wildcard fallback */}
      <Route path="*" element={<h2>404 Page Not Found</h2>} />
    </Routes>
  </AppLayout>
);

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
