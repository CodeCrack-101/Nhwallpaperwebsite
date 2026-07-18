/**
 * Cart Context Provider File
 * Location: frontend/src/context/CartContext.jsx
 * Description: Lightweight fallback context managing cart count and wishlist data
 *              to prevent Navbar badges and count links from causing runtime errors.
 */

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Standard mock counts for UI presentation
    const [cartItemCount, setCartItemCount] = useState(0);
    const [wishlist, setWishlist] = useState([]);

    const addToCart = (_product) => {
        setCartItemCount(prev => prev + 1);
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cartItemCount, wishlist, addToCart, toggleWishlist }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be consumed within a CartProvider');
    }
    return context;
};
