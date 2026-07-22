/**
 * Wishlist Page Component File
 * Location: frontend/src/pages/Wishlist.jsx
 * Description: Premium Wishlist overview page allowing saved designs tracking,
 *              moving items to active cart sessions, or removal actions.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import ImageLoader from '../components/common/ImageLoader';
import ButtonLoader from '../components/common/ButtonLoader';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, addToCart, removeFromWishlist, refreshWishlist } = useCart();

    React.useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const handleMoveToCart = (item) => {
        addToCart(item, 1);
        removeFromWishlist(item.id);

        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Save to MongoDB (Cart)
        // TODO: Delete from MongoDB (Wishlist)
        // ===============================
    };

    const handleItemRemove = (itemId) => {
        removeFromWishlist(itemId);

        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Delete from MongoDB (Wishlist)
        // ===============================
    };

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page-container">
                <div className="empty-wishlist-view">
                    <div style={{ display: 'inline-flex', padding: '25px', backgroundColor: '#faf6f0', color: '#C89B5B', borderRadius: '50%', fontSize: '40px', marginBottom: '20px' }}>
                        <FiHeart />
                    </div>
                    <h2 className="empty-wishlist-title">Your wishlist is empty</h2>
                    <p className="empty-wishlist-subtitle">Save wallpaper designs you love here to easily purchase or view them later.</p>
                    <Link to="/shop" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 30px',
                        backgroundColor: '#C89B5B',
                        color: '#fff',
                        fontWeight: '600',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 15px rgba(200, 155, 91, 0.3)'
                    }}>
                        <FiArrowLeft /> Explore Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page-container">
            <h1 className="wishlist-title">Your <span>Wishlist</span></h1>

            <div className="wishlist-grid">
                {wishlist.map((item) => (
                    <div key={item.id} className="wishlist-card">
                        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="wishlist-card-image" style={{ position: 'relative', overflow: 'hidden' }}>
                                <ImageLoader 
                                    src={item.img} 
                                    alt={item.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    containerStyle={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        </Link>
                        
                        <div className="wishlist-card-content">
                            <div>
                                <span className="wishlist-card-category">{item.category}</span>
                                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 className="wishlist-card-name">{item.name}</h3>
                                </Link>
                                <div className="wishlist-card-price">
                                    ₹{item.price.toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div className="wishlist-card-actions">
                                <ButtonLoader 
                                    className="btn-move-cart" 
                                    onClick={() => handleMoveToCart(item)}
                                    color="#ffffff"
                                    size="small"
                                >
                                    <FiShoppingBag /> Move To Cart
                                </ButtonLoader>
                                
                                <button 
                                    className="btn-remove-wishlist" 
                                    onClick={() => handleItemRemove(item.id)}
                                >
                                    <FiTrash2 /> Remove Item
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
