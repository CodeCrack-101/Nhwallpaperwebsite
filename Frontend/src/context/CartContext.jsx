/**
 * Cart Context Provider File
 * Location: frontend/src/context/CartContext.jsx
 * Description: Manages user-specific shopping cart and wishlist states.
 *              Synchronizes with MongoDB for logged-in users and LocalStorage for guest users.
 *              Exposes functions to add, update, remove, and clear cart/wishlist items.
 *              Includes elegant toast notification alerts.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import axiosInstance from '../api/axiosInstance';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    /**
     * Map MongoDB backend cart items to the frontend-expected schema shape.
     * Keeps `id` and `img` variables compatible with existing components.
     */
    const mapBackendCart = (backendItems) => {
        if (!backendItems) return [];
        return backendItems.map(item => ({
            id: item.productId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            img: item.productImage,
            productImage: item.productImage,
            category: item.category || 'Seating',
            quantity: item.quantity
        }));
    };

    /**
     * Map MongoDB backend wishlist products to the frontend-expected schema shape.
     * Keeps `id` and `img` variables compatible with existing components.
     */
    const mapBackendWishlist = (backendProducts) => {
        if (!backendProducts) return [];
        return backendProducts.map(item => ({
            id: item.productId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            img: item.productImage,
            productImage: item.productImage,
            category: item.category || 'Seating'
        }));
    };

    /**
     * Explicitly refetch the authenticated user's cart from MongoDB
     */
    const refreshCart = useCallback(async () => {
        if (isAuthenticated && user) {
            try {
                const cartRes = await axiosInstance.get('/cart');
                if (cartRes.data && cartRes.data.success) {
                    setCart(mapBackendCart(cartRes.data.items));
                }
            } catch (error) {
                console.error('[CART CONTEXT] Refresh cart failed:', error.message);
            }
        }
    }, [isAuthenticated, user]);

    /**
     * Explicitly refetch the authenticated user's wishlist from MongoDB
     */
    const refreshWishlist = useCallback(async () => {
        if (isAuthenticated && user) {
            try {
                const wishlistRes = await axiosInstance.get('/wishlist');
                if (wishlistRes.data && wishlistRes.data.success) {
                    setWishlist(mapBackendWishlist(wishlistRes.data.products));
                }
            } catch (error) {
                console.error('[CART CONTEXT] Refresh wishlist failed:', error.message);
            }
        }
    }, [isAuthenticated, user]);

    // Synchronize Cart and Wishlist based on active authentication session
    useEffect(() => {
        const syncUserData = async () => {
            if (isAuthenticated && user) {
                // Perform initial fetch on login/mount
                await refreshCart();
                await refreshWishlist();
            } else {
                // Load guest states from LocalStorage if not logged in.
                // Clear any leftover authenticated cart/wishlist cache from memory immediately.
                const storedGuestCart = localStorage.getItem('wallart_cart_guest');
                setCart(storedGuestCart ? JSON.parse(storedGuestCart) : []);

                const storedGuestWishlist = localStorage.getItem('wallart_wishlist_guest');
                setWishlist(storedGuestWishlist ? JSON.parse(storedGuestWishlist) : []);
            }
        };

        syncUserData();
    }, [isAuthenticated, user, refreshCart, refreshWishlist]);

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
     * Add selected product to the cart (MongoDB for authenticated users, localStorage for guests)
     */
    const addToCart = async (product, quantity = 1) => {
        const prodId = product.id || product._id || product.productId;

        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.post('/cart', {
                    productId: prodId,
                    name: product.name,
                    price: product.price,
                    productImage: product.img || product.productImage,
                    category: product.category,
                    quantity
                });
                if (res.data && res.data.success) {
                    setCart(mapBackendCart(res.data.items));
                    triggerToast(`Added ${product.name} to Cart!`, 'success');
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Add to MongoDB failed:', error.message);
                triggerToast('Failed to add item to cart.', 'error');
            }
        } else {
            // Guest session: update state and write explicitly to guest storage
            setCart(prev => {
                const existingIndex = prev.findIndex(item => (item.id || item.productId) === prodId);
                let updatedCart;

                if (existingIndex > -1) {
                    updatedCart = prev.map((item, idx) =>
                        idx === existingIndex
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    updatedCart = [...prev, {
                        id: prodId,
                        productId: prodId,
                        name: product.name,
                        price: product.price,
                        img: product.img || product.productImage,
                        productImage: product.img || product.productImage,
                        category: product.category || 'Seating',
                        quantity
                    }];
                }

                localStorage.setItem('wallart_cart_guest', JSON.stringify(updatedCart));
                return updatedCart;
            });
            triggerToast(`Added ${product.name} to Cart!`, 'success');
        }
    };

    /**
     * Remove select item from cart
     */
    const removeFromCart = async (productId) => {
        const item = cart.find(i => (i.id || i.productId) === productId);

        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.delete(`/cart/${productId}`);
                if (res.data && res.data.success) {
                    setCart(mapBackendCart(res.data.items));
                    if (item) triggerToast(`Removed ${item.name} from Cart.`, 'error');
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Delete from MongoDB failed:', error.message);
                triggerToast('Failed to remove item.', 'error');
            }
        } else {
            // Guest session removal
            setCart(prev => {
                const updatedCart = prev.filter(item => (item.id || item.productId) !== productId);
                localStorage.setItem('wallart_cart_guest', JSON.stringify(updatedCart));
                return updatedCart;
            });
            if (item) {
                triggerToast(`Removed ${item.name} from Cart.`, 'error');
            }
        }
    };

    /**
     * Modify item quantity in the cart
     */
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.put(`/cart/${productId}`, { quantity: newQuantity });
                if (res.data && res.data.success) {
                    setCart(mapBackendCart(res.data.items));
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Update quantity in MongoDB failed:', error.message);
            }
        } else {
            // Guest session update
            setCart(prev => {
                const updatedCart = prev.map(item =>
                    (item.id || item.productId) === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                localStorage.setItem('wallart_cart_guest', JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    /**
     * Empty all cart items
     */
    const clearCart = async () => {
        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.delete('/cart');
                if (res.data && res.data.success) {
                    setCart([]);
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Clear MongoDB cart failed:', error.message);
            }
        } else {
            // Guest session clear
            setCart([]);
            localStorage.setItem('wallart_cart_guest', JSON.stringify([]));
        }
    };

    /**
     * Save product to the user-specific wishlist (MongoDB when logged in, localStorage when guest)
     */
    const addToWishlist = async (product) => {
        const prodId = product.id || product._id || product.productId;

        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.post('/wishlist', {
                    productId: prodId,
                    name: product.name,
                    price: product.price,
                    productImage: product.img || product.productImage,
                    category: product.category || 'Seating'
                });
                if (res.data && res.data.success) {
                    setWishlist(mapBackendWishlist(res.data.products));
                    triggerToast(`Saved ${product.name} to Wishlist!`, 'success');
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Add to Wishlist MongoDB failed:', error.message);
                triggerToast('Failed to save wishlist item.', 'error');
            }
        } else {
            // Guest session wishlist add
            setWishlist(prev => {
                const exists = prev.some(item => (item.id || item.productId || item._id) === prodId);
                if (exists) return prev;
                const updatedWishlist = [...prev, {
                    id: prodId,
                    productId: prodId,
                    name: product.name,
                    price: product.price,
                    img: product.img || product.productImage,
                    productImage: product.img || product.productImage,
                    category: product.category || 'Seating'
                }];
                localStorage.setItem('wallart_wishlist_guest', JSON.stringify(updatedWishlist));
                return updatedWishlist;
            });
            triggerToast(`Saved ${product.name} to Wishlist!`, 'success');
        }
    };

    /**
     * Remove item from wishlist (MongoDB when logged in, localStorage when guest)
     */
    const removeFromWishlist = async (productId) => {
        const item = wishlist.find(i => (i.id || i.productId || i._id) === productId);

        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.delete(`/wishlist/${productId}`);
                if (res.data && res.data.success) {
                    setWishlist(mapBackendWishlist(res.data.products));
                    if (item) triggerToast(`Removed ${item.name} from Wishlist.`, 'error');
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Remove from Wishlist MongoDB failed:', error.message);
                triggerToast('Failed to remove item from wishlist.', 'error');
            }
        } else {
            // Guest session wishlist remove
            setWishlist(prev => {
                const updatedWishlist = prev.filter(item => (item.id || item.productId || item._id) !== productId);
                localStorage.setItem('wallart_wishlist_guest', JSON.stringify(updatedWishlist));
                return updatedWishlist;
            });
            if (item) {
                triggerToast(`Removed ${item.name} from Wishlist.`, 'error');
            }
        }
    };

    /**
     * Check if product is currently saved in wishlist
     */
    const isInWishlist = (productId) => {
        return wishlist.some(item => (item.id || item.productId || item._id) === productId);
    };

    // Calculate aggregated states
    const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const wishlistItemCount = wishlist.length;
    const totalPrice = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

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
        refreshCart,
        refreshWishlist,
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
