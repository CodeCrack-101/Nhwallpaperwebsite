/**
 * Checkout Page Component File
 * Location: frontend/src/pages/Checkout.jsx
 * Description: Protected checkout placeholder page.
 */

import React from 'react';

const Checkout = () => {
    return (
        <div style={{
            maxWidth: '600px',
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
                Secure <span>Checkout</span>
            </h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
                Select payment options and verify shipping address details.
            </p>
        </div>
    );
};

export default Checkout;
