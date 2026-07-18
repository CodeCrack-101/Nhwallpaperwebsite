import React from 'react';
import './Product.css';

const Product = () => {
  const collections = [
    {
      id: 1,
      title: 'PREMIUM NON ADHESIVE WALLPAPER',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop', // Replace with your actual image path
    },
    {
      id: 2,
      title: 'SELF-ADHESIVE WALLPAPER (2M) — STARTER SIZE',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop', // Replace with your actual image path
    },
    {
      id: 3,
      title: 'PREMIUM SELF-ADHESIVE WALLPAPER ROLLS (10M)',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=600&auto=format&fit=crop', // Replace with your actual image path
    },
    {
      id: 4,
      title: 'UV FOAM SHEET 2X2FT',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600&auto=format&fit=crop', // Replace with your actual image path
    },
  ];

  return (
    <section className="collection-section">
      {/* Header Info */}
      <div className="collection-header">
        <h2 className="collection-title">Shop by our Premium Wall Collection</h2>
        <p className="collection-subtitle">Explore a Wide Range of varieties Across</p>
      </div>

      {/* Grid Container */}
      <div className="collection-grid">
        {collections.map((item) => (
          <div key={item.id} className="collection-card">
            <div className="card-image-wrapper">
              <img src={item.image} alt={item.title} className="card-image" />
            </div>
            
            {/* Overlay Tag Button */}
            <div className="card-tag">
              <span className="tag-text">{item.title}</span>
              <span className="tag-arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product;