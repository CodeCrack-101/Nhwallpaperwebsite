/**
 * BestProduct Component File
 * Location: frontend/src/components/Allproduct/BestProduct.jsx
 * Description: Renders the primary categories catalog page showing SOHO, Executive Chair,
 *              Gaming Chair, Office Chair, Visitor Chair, and Workstation categories.
 *              Includes a live search bar to filter categories dynamically.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import './BestProduct.css';

// Direct Assets Imports
import sh1 from '../../assets/SOHO/sh1.png';
import sk1 from '../../assets/SKY/sk1.png';
import sp1 from '../../assets/SP/sp1.png';
import ur1 from '../../assets/URBANO/ur1.png';
import sh3 from '../../assets/SOHO/sh3.png';
import ur3 from '../../assets/URBANO/ur3.png';

const categories = [
    {
        id: 'soho',
        name: 'SOHO Chairs',
        path: '/soho',
        img: sh1,
        desc: 'Premium home office seats blending Scandinavian minimalism with posture ergonomics.'
    },
    {
        id: 'executive',
        name: 'Executive Chairs',
        path: '/sky',
        img: sk1,
        desc: 'Cabin-worthy top grain leather thrones built for leaders and visionaries.'
    },
    {
        id: 'gaming',
        name: 'Gaming Chairs',
        path: '/gaming',
        img: sp1,
        desc: 'Reclining high-back racing seats designed to support endless intense gaming sessions.'
    },
    {
        id: 'office',
        name: 'Office Chairs',
        path: '/office',
        img: ur1,
        desc: 'Durable taskmesh chairs perfect for high-traffic office floors and shared desks.'
    },
    {
        id: 'visitor',
        name: 'Visitor Chairs',
        path: '/visitor',
        img: sh3,
        desc: 'Comfortable, compact seating choices for reception areas and meeting rooms.'
    },
    {
        id: 'workstation',
        name: 'Workstation Seating',
        path: '/workstation',
        img: ur3,
        desc: 'Multi-functional draft chairs and task stools optimized for active collaborative desks.'
    }
];

const BestProduct = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() => {
        return categories.filter((cat) =>
            `${cat.name} ${cat.desc}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="best-products-container">
            <header className="catalogue-header">
                <h1 className="catalogue-title">Premium <span>Seating Collections</span></h1>
                <p className="catalogue-subtitle">Discover high-end ergonomic design and luxury craftsmanship tailored to your space.</p>
            </header>

            {/* Catalogue Search Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '500px',
                margin: '0 auto 50px auto',
                border: '1px solid #e5e5e5',
                borderRadius: '30px',
                padding: '10px 22px',
                backgroundColor: '#fff',
                position: 'relative',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
                fontFamily: "'Poppins', sans-serif"
            }}>
                <FiSearch style={{ color: '#888', marginRight: '12px', fontSize: '16px' }} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        border: 'none',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: "'Poppins', sans-serif",
                        color: '#333',
                        background: 'transparent'
                    }}
                />
                {searchTerm && (
                    <FiX 
                        style={{ color: '#888', cursor: 'pointer', fontSize: '16px' }} 
                        onClick={() => setSearchTerm('')} 
                    />
                )}
            </div>

            {filteredCategories.length > 0 ? (
                <div className="categories-grid">
                    {filteredCategories.map((cat) => (
                        <Link key={cat.id} to={cat.path} className="category-card">
                            <div 
                                className="category-image-box"
                                style={{ backgroundImage: `url(${cat.img})` }}
                            >
                                <div className="category-image-overlay" />
                            </div>
                            <div className="category-card-body">
                                <h3 className="category-card-name">{cat.name}</h3>
                                <p className="category-card-desc">{cat.desc}</p>
                                <span className="category-card-link">
                                    Browse Collection &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>
                    No categories found matching your search.
                </div>
            )}
        </div>
    );
};

export default BestProduct;
