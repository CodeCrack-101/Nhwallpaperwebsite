/**
 * Cart Context Provider File
 * Location: frontend/src/context/CartContext.jsx
 * Description: Manages cart and wishlist states, synchronizes with LocalStorage,
 *              and exposes functions to add, update, and remove items.
 *              Includes built-in elegant global toast animations for alerts.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Load initial values from LocalStorage if available
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem('wallart_cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const storedWishlist = localStorage.getItem('wallart_wishlist');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    });

    // Toast message state for alerts
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Synchronize Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('wallart_cart', JSON.stringify(cart));
    }, [cart]);

    // Synchronize Wishlist to LocalStorage
    useEffect(() => {
        localStorage.setItem('wallart_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    /**
     * Triggers a global animated alert toast
     */
    const triggerToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        const timer = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
        return () => clearTimeout(timer);
    };

    /**
     * Add selected product to the cart
     */
    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id);
            let updatedCart;

            if (existingIndex > -1) {
                // Item exists, increment quantity
                updatedCart = prev.map((item, idx) => 
                    idx === existingIndex 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                
                // ===============================
                // DATABASE INTEGRATION (FUTURE)
                // TODO: Update MongoDB
                // ===============================
            } else {
                // Item is new, append to cart
                updatedCart = [...prev, { ...product, quantity }];

                // ===============================
                // DATABASE INTEGRATION (FUTURE)
                // TODO: Save to MongoDB
                // ===============================
            }

            return updatedCart;
        });

        triggerToast(`Added ${product.name} to Cart!`, 'success');
    };

    /**
     * Remove select item from cart
     */
    const removeFromCart = (productId) => {
        const item = cart.find(i => i.id === productId);
        setCart(prev => prev.filter(item => item.id !== productId));
        
        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Delete from MongoDB
        // ===============================

        if (item) {
            triggerToast(`Removed ${item.name} from Cart.`, 'error');
        }
    };

    /**
     * Modify item quantity in the cart
     */
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setCart(prev => prev.map(item => 
            item.id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        ));

        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Update MongoDB
        // ===============================
    };

    /**
     * Empty all cart items
     */
    const clearCart = () => {
        setCart([]);
        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Delete from MongoDB
        // ===============================
    };

    /**
     * Save product to the wishlist
     */
    const addToWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.some(item => item.id === product.id);
            if (exists) return prev;

            // ===============================
            // DATABASE INTEGRATION (FUTURE)
            // TODO: Save to MongoDB
            // ===============================

            return [...prev, product];
        });
        triggerToast(`Saved ${product.name} to Wishlist!`, 'success');
    };

    /**
     * Remove item from wishlist
     */
    const removeFromWishlist = (productId) => {
        const item = wishlist.find(i => i.id === productId);
        setWishlist(prev => prev.filter(item => item.id !== productId));

        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Delete from MongoDB
        // ===============================

        if (item) {
            triggerToast(`Removed ${item.name} from Wishlist.`, 'error');
        }
    };

    /**
     * Check if product is currently saved in wishlist
     */
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    // Calculate aggregated states
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistItemCount = wishlist.length;
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const value = {
        cart,
        wishlist,
        cartItemCount,
        wishlistItemCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        triggerToast
    };

    return (
        <CartContext.Provider value={value}>
            {children}

            {/* Global floating toast notification overlay */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: toast.type === 'success' ? '#1f7a45' : '#ca3e3e',
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transform: 'translateY(0)',
                    animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                }}>
                    <span style={{ fontSize: '18px' }}>
                        {toast.type === 'success' ? '✓' : '✕'}
                    </span>
                    <span>{toast.message}</span>
                    <style>{`
                        @keyframes slideUp {
                            from { transform: translateY(50px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
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
