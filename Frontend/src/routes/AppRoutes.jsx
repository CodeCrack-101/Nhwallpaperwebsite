/**
 * React Router Configuration File
 * Location: frontend/src/routes/AppRoutes.jsx
 * Description: Sets up the browser routing hierarchy using React Router with lazy loading,
 *              React Suspense, and Mosaic page loaders to eliminate white screen flashes.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import PageLoader from '../components/common/PageLoader';

// Lazy Loaded Components/Pages for performance code-splitting
const Header = lazy(() => import('../components/Header/Header'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Profile = lazy(() => import('../pages/Profile'));
const Orders = lazy(() => import('../pages/Orders'));

// Category Components
const Soho = lazy(() => import('../components/Allproduct/Soho'));
const Sky = lazy(() => import('../components/Allproduct/Sky'));
const Uv = lazy(() => import('../components/Allproduct/Uv'));
// const Urbano = lazy(() => import('../components/Allproduct/Urbano'));
const Ew = lazy(() => import('../components/Allproduct/Ew'));
const Workstation = lazy(() => import('../components/Allproduct/Workstation'));
const DynamicCategoryRouter = lazy(() => import('../components/Allproduct/DynamicCategoryRouter'));

// Inner Pages
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Cart = lazy(() => import('../pages/Cart'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Checkout = lazy(() => import('../pages/Checkout'));

/**
 * Protected Route Wrapper Component
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <PageLoader fullScreen={false} message="Verifying active session..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader fullScreen={false} message="Loading collection..." />}>
            <Routes>
                {/* Wrap all pages inside the MainLayout (Navbar + Footer) */}
                <Route path="/" element={<MainLayout/>}>

                    {/* ================= Public Home Route ================= */}
                    <Route index element={<Header />} />

                    {/* ================= Public Inner Pages ================= */}
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register/>} />
                    <Route path="product/:id" element={<ProductDetails/>} />
                    
                    {/* Dynamic Parameter Router matches path patterns matching /category/anyname */}
                    <Route path="category/:categoryName" element={<DynamicCategoryRouter />} />

                    {/* Legacy Base Fallbacks */}
                    <Route path="soho" element={<Soho/>} />
                    <Route path="sky" element={<Sky />} />
                    <Route path="gaming" element={<Uv />} />
                    {/* <Route path="office" element={<Urbano />} /> */}
                    <Route path="visitor" element={<Ew />} />
                    <Route path="workstation" element={<Workstation />} />

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
        </Suspense>
    );
};

export default AppRoutes;