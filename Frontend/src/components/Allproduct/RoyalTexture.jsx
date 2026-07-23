/**
 * Royal Texture Category Catalog Page Component
 * Location: frontend/src/components/Allproduct/RoyalTexture.jsx
 * Description: Renders all products under the ROYALTEXTURE category with infinite scrolling,
 *              live search filtering, lazy loaded images, and product details links.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCategory } from '../../data/products';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import InfiniteProductGrid from './InfiniteProductGrid';
import './CategoryProducts.css';

const RoyalTexture = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const products = useMemo(() => getProductsByCategory('ROYALTEXTURE'), []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            `${p.name} ${p.category} ${p.patternno}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    return (
        <main className="app-main" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
            {/* Back link */}
            <Link to="/" className="category-back-link">
                <FiArrowLeft /> Back to Catalogue
            </Link>

            {/* Page Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="category-heading-title">Royal Texture Catalogue</h1>
                <p className="category-heading-desc">Experience luxury with our Royalweave collection. Superior durability and elegant design make every room stand out.</p>
            </div>

            {/* Search Bar */}
            <div className="category-search-wrapper">
                <FiSearch className="category-search-icon" />
                <input
                    type="text"
                    placeholder="Search Royal Texture products..."
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

            {/* Infinite Scroll Product Grid */}
            <InfiniteProductGrid 
                products={filteredProducts} 
                emptyMessage="No Royal Texture products found matching your search." 
            />
        </main>
    );
};

export default RoyalTexture;
