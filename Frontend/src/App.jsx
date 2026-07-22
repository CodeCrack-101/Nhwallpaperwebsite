/**
 * Main Application Component File
 * Location: frontend/src/App.jsx
 * Description: Integrates global contexts (Loading, Auth, and Cart providers) and mounts
 *              the primary application routes.
 */

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    return (
        <LoadingProvider>
            <AuthProvider>
                <CartProvider>
                    <AppRoutes />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </CartProvider>
            </AuthProvider>
        </LoadingProvider>
    );
};

export default App;