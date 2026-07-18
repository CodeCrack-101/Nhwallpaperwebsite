/**
 * Product Details Page Component File
 * Location: frontend/src/pages/ProductDetails.jsx
 * Description: Premium detail view showing product image with cursor-following zoom,
 *              interactive thumbnail click selectors, specifications (Availability, Material,
 *              Dimensions, Warranty, Delivery), and Add to Cart/Wishlist integration.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiStar } from 'react-icons/fi';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    
    // ======================================
    // FUTURE DATABASE CODE
    // TODO: Fetch Product details from MongoDB
    // GET /api/products/:id
    // ======================================
    const product = getProductById(id);

    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
    
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('features');

    // Zoom Effect states
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    // Synchronize activeImage with product on load/id change
    useEffect(() => {
        if (product) {
            setActiveImage(product.img);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="product-details-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '20px' }}>Product Not Found</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>The item you are searching for does not exist in our collections.</p>
                <Link to="/shop" className="btn-add-cart" style={{ display: 'inline-flex', width: 'auto', textDecoration: 'none' }}>
                    <FiArrowLeft /> Back to Shop
                </Link>
            </div>
        );
    }

    const isFav = isInWishlist(product.id);

    const handleQuantityChange = (val) => {
        if (val < 1) return;
        setQuantity(val);
    };

    const handleWishlistToggle = () => {
        if (isFav) {
            removeFromWishlist(product.id);
            
            // ======================================
            // FUTURE DATABASE CODE
            // TODO: Delete Item from MongoDB
            // ======================================
        } else {
            addToWishlist(product);

            // ======================================
            // FUTURE DATABASE CODE
            // TODO: Save Wishlist to MongoDB
            // ======================================
        }
    };

    const handleCartSubmit = () => {
        addToCart(product, quantity);

        // ======================================
        // FUTURE DATABASE CODE
        // TODO: Save Cart to MongoDB
        // ======================================
    };

    // Zoom Move Tracker
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="product-details-container">
            <Link to="/shop" className="back-link">
                <FiArrowLeft style={{ marginRight: '5px' }} /> Back to Catalogue
            </Link>

            <div className="product-grid">
                {/* Left side: Premium Image block with zoom and thumbnails */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div 
                        className="product-image-section"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                        style={{ overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
                    >
                        <img 
                            src={activeImage || product.img} 
                            alt={product.name} 
                            className="product-main-image" 
                            style={{
                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                transform: isZoomed ? 'scale(2)' : 'scale(1)',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: isZoomed ? 'none' : 'transform 0.3s ease'
                            }}
                        />
                    </div>

                    {/* Thumbnail Images */}
                    {product.thumbnails && product.thumbnails.length > 0 && (
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-start' }}>
                            {product.thumbnails.map((thumb, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setActiveImage(thumb)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        border: (activeImage || product.img) === thumb ? '2px solid #C89B5B' : '1px solid #ddd',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={thumb} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side: Detailed descriptions & purchasing actions */}
                <div className="product-info-section">
                    <span className="product-category">{product.category} Collection</span>
                    <h1 className="product-name">{product.name}</h1>
                    
                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FiStar 
                                    key={i} 
                                    fill={i < Math.floor(product.rating) ? "#C89B5B" : "none"} 
                                    color="#C89B5B" 
                                />
                            ))}
                        </div>
                        <span className="reviews-count">({product.reviewsCount} customer reviews)</span>
                    </div>

                    <div className="product-price">
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <p className="product-desc">{product.description}</p>

                    {/* Specifications grid section */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '15px', 
                        marginBottom: '30px', 
                        backgroundColor: '#fafafa', 
                        padding: '20px', 
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        fontSize: '13px'
                    }}>
                        <div>
                            <strong style={{ color: '#333' }}>Availability:</strong> 
                            <span style={{ marginLeft: '6px', color: product.availability.includes('stock') && !product.availability.includes('Out') ? '#1f7a45' : '#ca3e3e', fontWeight: '600' }}>
                                {product.availability}
                            </span>
                        </div>
                        <div>
                            <strong style={{ color: '#333' }}>Material:</strong> 
                            <span style={{ marginLeft: '6px', color: '#666' }}>{product.material}</span>
                        </div>
                        <div>
                            <strong style={{ color: '#333' }}>Dimensions:</strong> 
                            <span style={{ marginLeft: '6px', color: '#666' }}>{product.dimensions}</span>
                        </div>
                        <div>
                            <strong style={{ color: '#333' }}>Warranty:</strong> 
                            <span style={{ marginLeft: '6px', color: '#666' }}>{product.warranty}</span>
                        </div>
                    </div>

                    <div className="purchase-section">
                        <div className="quantity-control">
                            <span className="quantity-label">Quantity</span>
                            <div className="qty-btn-group">
                                <button 
                                    className="qty-adjust-btn" 
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    className="qty-input"
                                />
                                <button 
                                    className="qty-adjust-btn" 
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="action-buttons-group">
                            <button className="btn-add-cart" onClick={handleCartSubmit}>
                                <FiShoppingBag /> Add To Cart
                            </button>
                            
                            <button 
                                className={`btn-wishlist-toggle ${isFav ? 'active' : ''}`}
                                onClick={handleWishlistToggle}
                            >
                                <FiHeart fill={isFav ? "#ffffff" : "none"} /> 
                                {isFav ? 'In Wishlist' : 'Add To Wishlist'}
                            </button>
                        </div>
                    </div>

                    {/* Shipping & features tabs */}
                    <div className="tabs-section">
                        <div className="tab-headers">
                            <button 
                                className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                                onClick={() => setActiveTab('features')}
                            >
                                Key Features
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
                                onClick={() => setActiveTab('delivery')}
                            >
                                Delivery Information
                            </button>
                        </div>

                        <div className="tab-pane-content">
                            {activeTab === 'features' ? (
                                <ul className="features-list">
                                    {(product.features || [
                                        'Ergonomic lumbar support design to maintain optimal spinal alignment',
                                        'Pneumatic seat height adjustability for customizable desk fit',
                                        '360-degree silent nylon swivel casters for smooth transitions',
                                        'High-density contoured foam cushion seat for prolonged comfort'
                                    ]).map((feat, idx) => (
                                        <li key={idx}>{feat}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ margin: 0, paddingLeft: '5px' }}>{product.deliveryInfo}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
