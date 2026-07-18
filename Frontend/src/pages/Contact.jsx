/**
 * Contact Page Component File
 * Location: frontend/src/pages/Contact.jsx
 * Description: Displays customer care and contact form options.
 */

import React from 'react';

const Contact = () => {
    return (
        <div style={{
            maxWidth: '600px',
            margin: '80px auto',
            padding: '40px',
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: '#fff',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid #eee'
        }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '10px', textAlign: 'center' }}>
                Contact <span>Us</span>
            </h1>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>
                Have questions or need custom sizes? Let us know!
            </p>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                <input type="text" placeholder="Your Name" required style={inputStyle} />
                <input type="email" placeholder="Your Email" required style={inputStyle} />
                <textarea placeholder="Write your message here..." rows="5" required style={{ ...inputStyle, resize: 'none' }} />
                <button type="submit" style={btnStyle}>Send Message</button>
            </form>
        </div>
    );
};

const inputStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    width: '100%'
};

const btnStyle = {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#C89B5B',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px'
};

export default Contact;
