/**
 * Cart Page Component File
 * Location: frontend/src/pages/Cart.jsx
 * Description: Protected cart placeholder page.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
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
                Your Shopping <span>Cart</span>
            </h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
                Your cart is currently empty. Start adding luxury wallpapers to redefine your spaces!
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
                Browse Wallpapers
            </Link>
        </div>
    );
};

export default Cart;
