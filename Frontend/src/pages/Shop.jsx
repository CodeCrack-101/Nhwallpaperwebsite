/**
 * Shop Page Component File
 * Location: frontend/src/pages/Shop.jsx
 * Description: Displays products catalog fetched from the shared mock database.
 *              Allows navigation to detail view of each wallpaper.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../data/products';

const Shop = () => {
    // ===============================
    // DATABASE INTEGRATION (FUTURE)
    // TODO: Fetch from MongoDB
    // GET /api/products
    // ===============================

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '80px auto',
            padding: '0 20px',
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>
                    Explore Our <span>Collections</span>
                </h1>
                <p style={{ color: '#666', fontSize: '16px' }}>
                    Handcrafted wallpapers designed to breathe life into your home.
                </p>
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '30px',
                marginTop: '20px'
            }}>
                {mockProducts.map((item) => (
                    <Link 
                        key={item.id} 
                        to={`/product/${item.id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <div className="product-card" style={{
                            background: '#fff',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            border: '1px solid #eee',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                        }}
                        >
                            <div style={{
                                backgroundImage: `url(${item.img})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '240px',
                                width: '100%'
                            }} />
                            
                            <div style={{ 
                                padding: '20px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                flexGrow: 1, 
                                justifyContent: 'space-between' 
                            }}>
                                <div>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '1px', 
                                        color: '#C89B5B', 
                                        fontWeight: '600' 
                                    }}>
                                        {item.category}
                                    </span>
                                    <h3 style={{ 
                                        fontSize: '18px', 
                                        fontWeight: '600', 
                                        marginTop: '5px', 
                                        marginBottom: '10px',
                                        color: '#111'
                                    }}>
                                        {item.name}
                                    </h3>
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginTop: '10px'
                                }}>
                                    <p style={{ color: '#C89B5B', fontWeight: '700', fontSize: '18px', margin: 0 }}>
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </p>
                                    <span style={{ 
                                        fontSize: '13px', 
                                        color: '#C89B5B', 
                                        fontWeight: '600',
                                        border: '1px solid #C89B5B',
                                        borderRadius: '20px',
                                        padding: '4px 12px',
                                        transition: 'all 0.3s'
                                    }}>
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Shop;
