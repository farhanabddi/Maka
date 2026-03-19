// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import CreditLedger from './pages/CreditLedger';
import Expenses from './pages/Expenses';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

// Route Guard Component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  // If no user is logged in, redirect them to the login page
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Wrapped in Layout via PrivateRoute) */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/pos" element={<PrivateRoute><POS /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/credit" element={<PrivateRoute><CreditLedger /></PrivateRoute>} />
          <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}