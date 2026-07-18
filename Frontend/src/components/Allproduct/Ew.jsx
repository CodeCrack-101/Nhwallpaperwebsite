/**
 * Visitor Chair (Ew) Category Catalog Page File
 * Location: frontend/src/components/Allproduct/Ew.jsx
 * Description: Renders products under the Visitor Chair category.
 *              Allows searching and links directly to separate ProductDetails page.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCategory } from '../../data/products';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import './CategoryProducts.css';

// For Visitor chairs, display a subset of SOHO products as a fallback
const products = getProductsByCategory('SOHO').slice(2, 4);

const Ew = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            `${p.name} ${p.category}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <main className="app-main" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
            {/* Back link */}
            <Link to="/" className="category-back-link">
                <FiArrowLeft /> Back to Catalogue
            </Link>

            {/* Page Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="category-heading-title">Visitor Chairs</h1>
                <p className="category-heading-desc">Comfortable, compact seating choices for reception areas and meeting rooms.</p>
            </div>

            {/* Search Bar */}
            <div className="category-search-wrapper">
                <FiSearch className="category-search-icon" />
                <input
                    type="text"
                    placeholder="Search Visitor products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="category-search-input"
                />
                {searchTerm && (
                    <FiX 
                        className="category-clear-icon" 
                        onClick={() => setSearchTerm('')} 
                    />
                )}
            </div>

            {/* Grid List */}
            {filteredProducts.length > 0 ? (
                <div className="category-products-grid">
                    {filteredProducts.map((product) => (
                        <Link 
                            key={product.id} 
                            to={`/product/${product.id}`}
                            className="category-product-card"
                        >
                            <div 
                                className="category-product-image"
                                style={{ backgroundImage: `url(${product.img})` }} 
                            />
                            
                            <div className="category-product-body">
                                <div>
                                    <h3 className="category-product-title">
                                        {product.name}
                                    </h3>
                                    <p className="category-product-desc">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="category-product-footer">
                                    <span className="category-product-price">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="category-product-btn">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="category-no-results">No Visitor chairs found.</div>
            )}
        </main>
    );
};

export default Ew;
