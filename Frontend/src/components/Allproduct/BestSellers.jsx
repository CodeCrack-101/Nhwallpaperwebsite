import React, { useState } from 'react';
import './BestSellers.css';

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState('premium');
  // State to track how many products are visible (starts at 4)
  const [visibleCount, setVisibleCount] = useState(4);
  const products = [
    {
      id: 1,
      brand: 'SOHO',
      title: 'Wahable',
      originalPrice: 1500.00,
      salePrice: 800.00,
      rating: 5,
      isSoldOut: false,
      badge: 'SAVE 25%',
      image: '',
    },
    {
      id: 2,
      brand: 'EW',
      title: 'SELF ADHESIVE ROYAL FLOWER DESIGN WALLPAPER 10M X 18IN | ELEGANT FLORAL WALL DECOR',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: false,
      badge: 'SAVE 25%',
      image: '',
    },
    {
      id: 3,
      brand: 'SKY',
      title: 'SELF ADHESIVE WHITE GOLD OVAL WALLPAPER 10M X 18IN | ELEGANT GEOMETRIC WALL DECOR',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: true,
      badge: 'SOLD OUT',
      image: '',
    },
    {
      id: 4,
      brand: 'Urbano',
      title: 'SELF ADHESIVE GEOMETRIC DESIGN WALLPAPER 10M X 18IN | MODERN WALL DECOR FOR HOME',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: false,
      badge: 'SAVE 25%',
      image: '',
    },
    {
      id: 5,
      brand: 'Foam Sheet',
      title: 'SELF ADHESIVE GEOMETRIC DESIGN WALLPAPER 10M X 18IN | MODERN WALL DECOR FOR HOME',
      originalPrice: 600.00,
      salePrice: 449.00,
      rating: 0,
      isSoldOut: false,
      badge: 'SAVE 25%',
      image: '',
    }
  ];

  // Handles both expanding (+4) and resetting back to initial view (4)
  const handleToggleProducts = () => {
    if (visibleCount >= products.length) {
      setVisibleCount(4); // Reset back to initial state
    } else {
      setVisibleCount((prevCount) => prevCount + 4); // Load next 4 elements
    }
  };

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
    
      {/* Dynamic Product Grid */}
      <div className="products-grid">
        {products.slice(0, visibleCount).map((product, index) => (
          <div key={`${product.id}-${index}`} className="product-card">
            <div className="product-image-box">
              <img src={product.image} alt={product.title} className="product-img" />
              {product.badge && (
                <span className={`badge-tag ${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
            </div>

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

            <button 
              className={`action-btn ${product.isSoldOut ? 'btn-soldout' : 'btn-add'}`}
              disabled={product.isSoldOut}
            >
              {product.isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}
            </button>
          </div>
        ))}
      </div>

      {/* Conditional Button: changes text depending on list status */}
      <div className="view-more-container">
        <button className="view-more-btn" onClick={handleToggleProducts}>
          {visibleCount >= products.length ? 'View Less Products' : 'View More Products'}
        </button>
      </div>
    </div>
  );
};

export default BestSellers;