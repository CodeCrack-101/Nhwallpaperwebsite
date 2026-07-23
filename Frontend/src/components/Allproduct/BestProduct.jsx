/**
 * BestProduct Component File
 * Location: frontend/src/components/Allproduct/BestProduct.jsx
 * Description: Redesigned based on glassmorphic card design with verified badge,
 *              description, and pill CTA buttons.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { FaCheckCircle, FaUser, FaLayerGroup } from 'react-icons/fa';
import ImageLoader from '../common/ImageLoader';
import './BestProduct.css';

// Direct Assets Imports
import rt1 from '/rt.png'
import sh1 from '/Soho.png';
import wa1 from '/wa1.png';
import sk1 from '/Sky.png';
import sp1 from '/Selfiepoint.png'
import ew1 from '/Epicwall.png';

const categories = [
    {
        id: 'soho',
        name: 'Soho',
        path: '/category/soho',
        img: sh1,
        desc: 'Product Designer who focuses on simplicity & usability.',
        itemsCount: 'Best Choice',
        rating: '60'
    },
    {
        id: 'sky',
        name: 'Sky',
        path: '/category/sky',
        img: sk1,
        desc: 'Cabin-worthy top grain leather thrones built for leaders.',
        itemsCount: 'Best Choice',
        rating: '42'
    },
    {
        id: 'royaltexture',
        name: 'Royal Texture',
        path: '/category/royaltexture',
        img: rt1,
        desc: 'Experience luxury with superior durability and design.',
        itemsCount: 'Best Choice',
        rating: '50'
    },
    {
        id: 'Wallflora',
        name: 'Wall Flora',
        path: '/category/wallfloral',
        img: wa1, 
        desc: 'Durable taskmesh chairs perfect for high-traffic office floors.',
        itemsCount: 'Best Choice',
        rating: '39'
    },
    {
        id: 'epicwall',
        name: 'Epic Wall',
        path: '/category/epicwall',
        img: ew1,
        desc: 'Premium artistic wallpaper & furniture accents.',
        itemsCount: 'Best Choice',
        rating: '49'
    },
    {
        id: 'SelfiePoint',
        name: 'Selfie Point',
        path: '/category/selfiepoint',
        img: sp1, 
        desc: 'Comfortable seating optimized for tech desks & productivity.',
        itemsCount: 'Best Choice',
        rating: '47'
    },
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
                            <div key={cat.id} className="category-card-outer">
                                <Link to={cat.path} className="category-card">
                                    <div className="category-image-wrapper">
                                        <ImageLoader 
                                            src={cat.img} 
                                            alt={cat.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            containerStyle={{ width: '100%', height: '100%' }}
                                        />
                                        
                                        {/* Bottom Glass Overlay Content */}
                                        <div className="card-glass-content">
                                            <div className="card-header-row">
                                                <h3 className="category-name">{cat.name}</h3>
                                                <FaCheckCircle className="verified-badge" />
                                            </div>
                                            
                                            <p className="category-desc">{cat.desc}</p>
                                            
                                            <div className="card-footer-row">
                                                <div className="card-stats">
                                                    <span className="stat-item"><FaUser className="stat-icon" /> {cat.itemsCount}</span>
                                                    <span className="stat-item"><FaLayerGroup className="stat-icon" /> {cat.rating}</span>
                                                </div>
                                                <button className="follow-pill-btn">View +</button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
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