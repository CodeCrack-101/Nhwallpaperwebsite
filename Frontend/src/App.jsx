/**
 * Main Application Component File
 * Location: frontend/src/App.jsx
 * Description: Integrates global contexts (Auth and Cart providers) and mounts
 *              the primary application routes.
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <AppRoutes />
            </CartProvider>
        </AuthProvider>
    );
};

export default App;