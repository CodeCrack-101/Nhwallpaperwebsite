/**
 * Cart Context Provider File
 * Location: frontend/src/context/CartContext.jsx
 * Description: Manages user-specific shopping cart and wishlist states.
 *              Synchronizes with MongoDB for logged-in users and LocalStorage for guest users.
 *              Exposes functions to add, update, remove, and clear cart/wishlist items.
 *              Includes elegant toast notification alerts.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartToasts, wishlistToasts, showError } from '../utils/toast';
import { useAuth } from './AuthContext';
import axiosInstance from '../api/axiosInstance';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

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
                await refreshCart();
                await refreshWishlist();
            } else {
                const storedGuestCart = localStorage.getItem('wallart_cart_guest');
                setCart(storedGuestCart ? JSON.parse(storedGuestCart) : []);

                const storedGuestWishlist = localStorage.getItem('wallart_wishlist_guest');
                setWishlist(storedGuestWishlist ? JSON.parse(storedGuestWishlist) : []);
            }
        };

        syncUserData();
    }, [isAuthenticated, user, refreshCart, refreshWishlist]);

    /**
     * Add selected product to the cart
     */
    const addToCart = async (product, quantity = 1, showToastNotification = true) => {
        const prodId = product.id || product._id || product.productId;
        const existsInCart = cart.some(item => (item.id || item.productId) === prodId);

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
                    if (showToastNotification) {
                        if (existsInCart) cartToasts.alreadyInCart();
                        else cartToasts.addToCart();
                    }
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Add to MongoDB failed:', error.message);
                showError('Failed to add item to cart.');
            }
        } else {
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
            if (showToastNotification) {
                if (existsInCart) cartToasts.alreadyInCart();
                else cartToasts.addToCart();
            }
        }
    };

    /**
     * Remove select item from cart
     */
    const removeFromCart = async (productId, showToastNotification = true) => {
        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.delete(`/cart/${productId}`);
                if (res.data && res.data.success) {
                    setCart(mapBackendCart(res.data.items));
                    if (showToastNotification) cartToasts.removeFromCart();
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Delete from MongoDB failed:', error.message);
                showError('Failed to remove item.');
            }
        } else {
            setCart(prev => {
                const updatedCart = prev.filter(item => (item.id || item.productId) !== productId);
                localStorage.setItem('wallart_cart_guest', JSON.stringify(updatedCart));
                return updatedCart;
            });
            if (showToastNotification) cartToasts.removeFromCart();
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
                    cartToasts.cartUpdated();
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Update quantity in MongoDB failed:', error.message);
            }
        } else {
            setCart(prev => {
                const updatedCart = prev.map(item =>
                    (item.id || item.productId) === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                localStorage.setItem('wallart_cart_guest', JSON.stringify(updatedCart));
                return updatedCart;
            });
            cartToasts.cartUpdated();
        }
    };

    /**
     * Empty all cart items
     */
    const clearCart = async (showToastNotification = true) => {
        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.delete('/cart');
                if (res.data && res.data.success) {
                    setCart([]);
                    if (showToastNotification) cartToasts.cartCleared();
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Clear MongoDB cart failed:', error.message);
            }
        } else {
            setCart([]);
            localStorage.setItem('wallart_cart_guest', JSON.stringify([]));
            if (showToastNotification) cartToasts.cartCleared();
        }
    };

    /**
     * Save product to the user-specific wishlist
     */
    const addToWishlist = async (product, showToastNotification = true) => {
        const prodId = product.id || product._id || product.productId;
        const existsInWishlist = wishlist.some(item => (item.id || item.productId || item._id) === prodId);

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
                    if (showToastNotification) {
                        if (existsInWishlist) wishlistToasts.alreadyInWishlist();
                        else wishlistToasts.addToWishlist();
                    }
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Add to Wishlist MongoDB failed:', error.message);
                showError('Failed to save wishlist item.');
            }
        } else {
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
            if (showToastNotification) {
                if (existsInWishlist) wishlistToasts.alreadyInWishlist();
                else wishlistToasts.addToWishlist();
            }
        }
    };

    /**
     * Remove item from wishlist
     */
    const removeFromWishlist = async (productId, showToastNotification = true) => {
        if (isAuthenticated && user) {
            try {
                const res = await axiosInstance.delete(`/wishlist/${productId}`);
                if (res.data && res.data.success) {
                    setWishlist(mapBackendWishlist(res.data.products));
                    if (showToastNotification) wishlistToasts.removeFromWishlist();
                }
            } catch (error) {
                console.error('[CART CONTEXT ERROR] Remove from Wishlist MongoDB failed:', error.message);
                showError('Failed to remove item from wishlist.');
            }
        } else {
            setWishlist(prev => {
                const updatedWishlist = prev.filter(item => (item.id || item.productId || item._id) !== productId);
                localStorage.setItem('wallart_wishlist_guest', JSON.stringify(updatedWishlist));
                return updatedWishlist;
            });
            if (showToastNotification) wishlistToasts.removeFromWishlist();
        }
    };

    /**
     * Move product from Wishlist to Cart
     */
    const moveWishlistToCart = async (product) => {
        const prodId = product.id || product._id || product.productId;
        await removeFromWishlist(prodId, false);
        await addToCart(product, 1, false);
        wishlistToasts.moveToCart();
    };

    /**
     * Move product from Cart to Wishlist
     */
    const moveCartToWishlist = async (product) => {
        const prodId = product.id || product._id || product.productId;
        await removeFromCart(prodId, false);
        await addToWishlist(product, false);
        wishlistToasts.moveToWishlist();
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
        moveWishlistToCart,
        moveCartToWishlist,
        isInWishlist,
        refreshCart,
        refreshWishlist
    };

    return (
        <CartContext.Provider value={value}>
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
