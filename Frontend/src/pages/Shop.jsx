/**
 * Shop Page Component File
 * Location: frontend/src/pages/Shop.jsx
 * Description: Displays products catalog placeholder with stylish styling.
 */

import React from 'react';

const Shop = () => {
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '80px auto',
            padding: '0 20px',
            fontFamily: "'Poppins', sans-serif",
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>
                Explore Our <span>Collections</span>
            </h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '40px' }}>
                Handcrafted wallpapers designed to breathe life into your home.
            </p>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
                marginTop: '20px'
            }}>
                {/* Wallpaper cards */}
                {[
                    { name: 'Floral Sanctuary', price: '₹1,499', img: 'https://images.unsplash.com/photo-1533038590840-1cde6e6e40dd?q=80&w=400' },
                    { name: 'Cosmic Starfield', price: '₹2,499', img: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=400' },
                    { name: 'Geometric Luxe', price: '₹1,999', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' },
                ].map((item, idx) => (
                    <div key={idx} style={{
                        background: '#fff',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        border: '1px solid #eee',
                        textAlign: 'left'
                    }}>
                        <div style={{
                            backgroundImage: `url(${item.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '240px'
                        }} />
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>{item.name}</h3>
                            <p style={{ color: '#C89B5B', fontWeight: '600', fontSize: '16px' }}>{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
