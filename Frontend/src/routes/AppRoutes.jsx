/**
 * React Router Configuration File
 * Location: frontend/src/routes/AppRoutes.jsx
 * Description: Sets up the browser routing hierarchy using React Router v6.
 *              Registers public layout routes and wraps protected dashboard pages.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import MainLayout from '../layouts/MainLayout';

// Components/Pages
import Header from '../components/Header/Header'; // Existing hero page component
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';

// Placeholders for complete UX routes
import Shop from '../pages/Shop';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';

/**
 * Protected Route Wrapper Component
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                fontFamily: "'Poppins', sans-serif"
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '18px', color: '#666', fontWeight: '500' }}>Verifying active session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Wrap all pages inside the MainLayout (Navbar + Footer) */}
            <Route path="/" element={<MainLayout />}>

                {/* ================= Public Routes ================= */}
                <Route index element={<Header />} /> {/* Existing home hero page */}
                <Route path="products" element={<Shop />} />
                <Route path="shop" element={<Shop />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* ================= Protected Routes ================= */}
                <Route path="profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />

                <Route path="orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />

                <Route path="cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />

                <Route path="wishlist" element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                } />

                <Route path="checkout" element={
                    <ProtectedRoute>
                        <Checkout />
                    </ProtectedRoute>
                } />

                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
