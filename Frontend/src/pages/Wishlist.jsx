/**
 * Wishlist Page Component File
 * Location: frontend/src/pages/Wishlist.jsx
 * Description: Protected wishlist placeholder page.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '100px auto',
            padding: '40px',
            fontFamily: "'Poppins', sans-serif",
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid #eee'
        }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '15px' }}>
                Your <span>Wishlist</span>
            </h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
                Save designs you love here. Your wishlist is currently empty.
            </p>
            <Link to="/shop" style={{
                display: 'inline-block',
                padding: '12px 30px',
                backgroundColor: '#C89B5B',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '30px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(200, 155, 91, 0.3)'
            }}>
                Explore Wallpapers
            </Link>
        </div>
    );
};

export default Wishlist;
