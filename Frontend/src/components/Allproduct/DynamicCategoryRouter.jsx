/**
 * Dynamic Category Router Component
 * Location: frontend/src/components/Allproduct/DynamicCategoryRouter.jsx
 * Description: Reads active catalog parameter identifiers via React Router hooks
 *              and resolves layout rendering or passes data matrices directly.
 */

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getProductsByCategory } from '../../data/products';

// If you have distinct explicit view files for each, you can switch render here:
import Soho from './Soho';
import Sky from './Sky';
import Uv from './Uv';
import Urbano from './Urbano';
import Ew from './Ew';
import Workstation from './Workstation';

const DynamicCategoryRouter = () => {
    const { categoryName } = useParams();
    const cleanName = categoryName ? categoryName.toLowerCase() : '';

    // Approach A: Map parameter string routing directly to your standalone layout views
    switch (cleanName) {
        case 'soho':
            return <Soho />;
        case 'sky':
            return <Sky />;
        case 'urbano':
        case 'office':
            return <Urbano />;
        case 'gaming':
            return <Uv />;
        case 'epicwall':
        case 'visitor':
            return <Ew />;
        case 'workstation':
            return <Workstation />;
        default:
            // Approach B: Dynamic Fallback Layout Interface utilizing products.js directly
            const products = getProductsByCategory(categoryName);
            if (products && products.length > 0) {
                return (
                    <div style={{ padding: '40px 5%', fontFamily: "'Poppins', sans-serif" }}>
                        <h2 style={{ textTransform: 'capitalize', marginBottom: '24px' }}>
                            {categoryName} Collection
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {products.map(product => (
                                <div key={product.id} style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px' }}>
                                    <img src={product.img} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'contain' }} />
                                    <h4 style={{ margin: '12px 0 6px 0' }}>{product.name}</h4>
                                    <p style={{ color: '#e67e22', fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            
            // Redirect smoothly to standard layout root if parameter doesn't match data database arrays
            return <Navigate to="/" replace />;
    }
};

export default DynamicCategoryRouter;