/**
 * Workstation Seating Category Catalog Page File
 * Location: frontend/src/components/Allproduct/Workstation.jsx
 * Description: Renders products under the Workstation category with infinite scroll,
 *              image lazy loading, and Mosaic indicators.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCategory } from '../../data/products';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import InfiniteProductGrid from './InfiniteProductGrid';
import './CategoryProducts.css';

const products = [
    ...getProductsByCategory('Office Chair').slice(2, 3),
    ...getProductsByCategory('SOHO').slice(3, 4)
];

const Workstation = () => {
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
                <h1 className="category-heading-title">Workstation Seating</h1>
                <p className="category-heading-desc">Multi-functional draft chairs and task stools optimized for active collaborative desks.</p>
            </div>

            {/* Search Bar */}
            <div className="category-search-wrapper">
                <FiSearch className="category-search-icon" />
                <input
                    type="text"
                    placeholder="Search Workstation products..."
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
                emptyMessage="No Workstation seating found." 
            />
        </main>
    );
};

export default Workstation;
