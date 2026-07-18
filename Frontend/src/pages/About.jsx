/**
 * About Page Component File
 * Location: frontend/src/pages/About.jsx
 * Description: Displays brand narrative and values.
 */

import React from 'react';

const About = () => {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '80px auto',
            padding: '0 20px',
            fontFamily: "'Poppins', sans-serif",
            lineHeight: '1.8',
            color: '#333'
        }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#111', marginBottom: '20px', textAlign: 'center' }}>
                Our <span>Story</span>
            </h1>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                At <strong>WALLART</strong> (NH Store), we believe that your walls should tell your story. Since our founding, we have been dedicated to sourcing and crafting the highest quality wallpapers, bringing vibrant imagery, luxury textures, and state-of-the-art designs directly to homes across India.
            </p>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                Each piece in our catalog is carefully curated, ensuring premium ink saturation, durable substrates, and seamless installation qualities. From calming nature motifs to celestial nebula backdrops, we cover every design aesthetic you could dream of.
            </p>
        </div>
    );
};

export default About;
