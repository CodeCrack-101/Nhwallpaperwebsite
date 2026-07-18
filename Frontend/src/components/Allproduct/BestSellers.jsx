import React, { useState } from 'react';
import './BestSellers.css';

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState('premium');

  const products = [
    {
      id: 1,
      brand: 'NIDHI DECOR',
      title: 'SELF ADHESIVE 3D GILDED HEXAGON WALLPAPER 10M X 18IN | LUXURY GEOMETRIC DECOR',
      originalPrice: 599.00,
      salePrice: 399.00,
      rating: 5,
      isSoldOut: true,
      badge: 'SOLD OUT',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: 2,
      brand: 'NIDHI DECOR',
      title: 'SELF ADHESIVE ROYAL FLOWER DESIGN WALLPAPER 10M X 18IN | ELEGANT FLORAL WALL DECOR',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: false,
      badge: 'SAVE 25%',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: 3,
      brand: 'NIDHI DECOR',
      title: 'SELF ADHESIVE WHITE GOLD OVAL WALLPAPER 10M X 18IN | ELEGANT GEOMETRIC WALL DECOR',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: true,
      badge: 'SOLD OUT',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: 4,
      brand: 'NIDHI DECOR',
      title: 'SELF ADHESIVE GEOMETRIC DESIGN WALLPAPER 10M X 18IN | MODERN WALL DECOR FOR HOME',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: false,
      badge: 'SAVE 25%',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=500&auto=format&fit=crop',
    },
  ];

  return (
    <div className="bestsellers-container">
      {/* Top Main Heading Area */}
      <header className="page-header">
        <h1 className="main-title">Make Your Home Truly Attractive</h1>
        <p className="main-subtitle">Transform Your Walls Into a Luxurious Masterpiece</p>
        <div className="search-wrapper">
          <input type="text" placeholder="Search Wallpapers..." className="search-input" />
        </div>
      </header>

      {/* Navigation & Section Title */}
      <div className="section-nav">
        <div className="nav-left">
          <h2 className="section-title">BEST SELLERS</h2>
          <p className="section-offer">LIMITED PERIOD OFFER ON BEST SELLER</p>
          <div className="tabs-container">
            <span 
              className={`tab-item ${activeTab === 'premium' ? 'active' : ''}`}
              onClick={() => setActiveTab('premium')}
            >
              PREMIUM SELF-ADHESIVE WALLPAPER ROLLS (10M)
            </span>
            <span className="tab-separator">/</span>
            <span 
              className={`tab-item ${activeTab === 'foam' ? 'active' : ''}`}
              onClick={() => setActiveTab('foam')}
            >
              UV FOAM SHEET 2X2FT
            </span>
          </div>
        </div>
        <div className="nav-right">
          <a href="#view-all" className="shop-all-link">Shop PREMIUM SELF-ADHESIVE WALLPAPER ROLLS (10M)</a>
        </div>
      </div>

      {/* Dynamic Product Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {/* Image Container with Absolute Badges */}
            <div className="product-image-box">
              <img src={product.image} alt={product.title} className="product-img" />
              {product.badge && (
                <span className={`badge-tag ${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Meta details */}
            <div className="product-info">
              <span className="brand-name">{product.brand}</span>
              <h3 className="product-title">{product.title}</h3>
              
              <div className="price-container">
                <span className="original-price">Rs. {product.originalPrice.toFixed(2)}</span>
                <span className="sale-price">Rs. {product.salePrice.toFixed(2)}</span>
              </div>

              {product.rating > 0 && (
                <div className="rating-stars">
                  {'★'.repeat(product.rating)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button 
              className={`action-btn ${product.isSoldOut ? 'btn-soldout' : 'btn-add'}`}
              disabled={product.isSoldOut}
            >
              {product.isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;