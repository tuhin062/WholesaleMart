/**
 * Main Application Component
 * Sets up routing and context providers
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardOverview from './pages/admin/DashboardOverview'; // New
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerLogin from './pages/customer/CustomerLogin';
import ProductCatalog from './pages/customer/ProductCatalog';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderTracking from './pages/customer/OrderTracking';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RetailerLayout from './layouts/RetailerLayout';

import './index.css';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireCustomer?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireCustomer = false }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/customer/catalog" replace />;
    }

    if (requireCustomer && user.role !== 'customer') {
        return <Navigate to="/admin/products" replace />;
    }

    return <>{children}</>;
};

function AppContent() {
    return (
        <Routes>
            {/* Public Routes - Wrapped in AuthLayout for consistent styling */}
            <Route element={<AuthLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
            </Route>

            {/* Admin Routes - Wrapped in DashboardLayout */}
            <Route
                element={
                    <ProtectedRoute requireAdmin>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/admin/dashboard" element={<DashboardOverview />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
            </Route>

            {/* Customer Routes - Wrapped in RetailerLayout */}
            <Route
                element={
                    <ProtectedRoute requireCustomer>
                        <RetailerLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/customer/catalog" element={<ProductCatalog />} />
                <Route path="/customer/cart" element={<Cart />} />
                <Route path="/customer/checkout" element={<Checkout />} />
                <Route path="/customer/orders" element={<OrderTracking />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
