import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/auth/Register';
import Products from './pages/products/Products';
import Courses from './pages/courses/Courses';
import Services from './pages/services/Services';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import CustomerOrders from './components/dashboard/CustomerOrders';
import CartButton from './components/cart/CartButton';
import CartSidebar from './components/cart/CartSidebar';
import ErrorBoundary from './components/ErrorBoundary';
import PublicLayout from './components/layout/PublicLayout';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />

            {/* Customer Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <UserDashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/orders" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CustomerOrders />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <AdminRoute>
                  <AuthenticatedLayout>
                    <AdminDashboard />
                  </AuthenticatedLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/products" 
              element={
                <AdminRoute>
                  <AuthenticatedLayout>
                    <Products />
                  </AuthenticatedLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/courses" 
              element={
                <AdminRoute>
                  <AuthenticatedLayout>
                    <Courses />
                  </AuthenticatedLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/services" 
              element={
                <AdminRoute>
                  <AuthenticatedLayout>
                    <Services />
                  </AuthenticatedLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/orders" 
              element={
                <AdminRoute>
                  <AuthenticatedLayout>
                    <CustomerOrders />
                  </AuthenticatedLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/dashboard/admin/services" 
              element={
                <AdminRoute>
                  <AuthenticatedLayout>
                    <Services />
                  </AuthenticatedLayout>
                </AdminRoute>
              } 
            />
          </Routes>

          {/* Global Components */}
          <CartButton onClick={() => setIsCartOpen(true)} />
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
