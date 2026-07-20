/**
 * BestProduct Component File
 * Location: frontend/src/components/Allproduct/BestProduct.jsx
 * Description: Renders the primary categories catalog page showing various collections.
 *              Includes a live search bar to filter categories dynamically.
 *              Displays 6 cards initially with full "View More" and "View Less" functionality.
 *              Card design matches the floating box layout from the reference image.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
// Make sure to import FontAwesome in your main app file (e.g., App.js) like: import '@fortawesome/fontawesome-free/css/all.min.css';
import './BestProduct.css';

// Direct Assets Imports mapped properly from the public structure
import sh1 from '/Soho.png';
import sk1 from '/Sky.png';
import ur1 from '/Urbano.png';
import wa1 from '/Wallfloral.png';
import ew1 from '/Epicwall.png';

const categories = [
    {
        id: 'soho',
        name: 'Soho',
        path: '/category/soho',
        img: sh1,
        desc: 'Premium home office seats blending Scandinavian minimalism with posture ergonomics.'
    },
    {
        id: 'sky',
        name: 'Sky',
        path: '/category/sky',
        img: sk1,
        desc: 'Cabin-worthy top grain leather thrones built for leaders and visionaries.'
    },
    {
        id: 'urbano',
        name: 'Urbano',
        path: '/category/urbano',
        img: ur1,
        desc: 'Reclining high-back racing seats designed to support endless intense gaming sessions.'
    },
    {
        id: 'Wallflora',
        name: 'Wall Flora',
        path: '/category/wallfloral',
        img: wa1, 
        desc: 'Durable taskmesh chairs perfect for high-traffic office floors and shared desks.'
    },
    {
        id: 'epicwall',
        name: 'Epic Wall',
        path: '/category/epicwall',
        img: ew1,
        desc: 'Durable taskmesh chairs perfect for high-traffic office floors and shared desks.'
    },
    {
        id: 'Mirabel',
        name: 'Mirabel',
        path: '/category/mirabel',
        img: sh1, 
        desc: 'Sleek guest chairs tailored for modern reception areas and meeting rooms.'
    },
    {
        id: 'SelfiePoint',
        name: 'Selfie Point',
        path: '/category/selfiepoint',
        img: ur1, 
        desc: 'Comfortable seating engineered optimized for productivity and tech desks.'
    },
    {
        id: 'Royaltexture',
        name: 'Royal Texture',
        path: '/category/royaltexture',
        img: sk1, 
        desc: 'Relaxed designer chairs bringing high-end comfort to breakout spaces.'
    }
];

const BestProduct = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);

    const filteredCategories = useMemo(() => {
        return categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleToggleVisibility = () => {
        if (visibleCount >= filteredCategories.length) {
            setVisibleCount(6); 
        } else {
            setVisibleCount((prev) => prev + 6); 
        }
    };

    return (
        <div className="best-products-container">
            <header className="catalogue-header">
                <h1 className="catalogue-title">Premium <span>Collections</span></h1>
                <p className="catalogue-subtitle">Discover high-end luxury craftsmanship tailored specifically to your space.</p>
            </header>

            {/* Catalogue Search Bar */}
            <div className="catalogue-search-wrapper">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {searchTerm && (
                    <FiX 
                        className="clear-icon" 
                        onClick={() => setSearchTerm('')} 
                    />
                )}
            </div>

            {filteredCategories.length > 0 ? (
                <>
                    <div className="categories-grid">
                        {filteredCategories.slice(0, visibleCount).map((cat) => (
                            <Link key={cat.id} to={cat.path} className="category-card">
                                <div 
                                    className="category-image-wrapper"
                                    style={{ backgroundImage: `url(${cat.img})` }}
                                >
                                    <div className="category-content-box">
                                        <h3 className="category-name">{cat.name}</h3>
                                        <i className="fa-solid fa-arrow-right-long category-arrow"></i>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View More / View Less Toggle Button */}
                    {filteredCategories.length > 6 && (
                        <div className="view-toggle-container">
                            <button className="view-toggle-btn" onClick={handleToggleVisibility}>
                                {visibleCount >= filteredCategories.length ? 'View Less' : 'View More'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="no-results-message">
                    No categories found matching your search.
                </div>
            )}
        </div>
    );
};

export default BestProduct;