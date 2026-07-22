/**
 * Product Skeleton Component
 * Location: frontend/src/components/common/ProductSkeleton.jsx
 * Description: Renders skeleton cards with subtle pulse animations to prevent layout shifting
 *              while product data or infinite scroll batches are loading.
 */

import React from 'react';

const ProductSkeleton = ({ count = 4, columns = 'repeat(auto-fill, minmax(250px, 1fr))' }) => {
    const cards = Array.from({ length: count });

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: columns,
            gap: '24px',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <style>{`
                @keyframes pulseSkeleton {
                    0% { background-color: #eee; }
                    50% { background-color: #e0e0e0; }
                    100% { background-color: #eee; }
                }
                .skeleton-box {
                    animation: pulseSkeleton 1.5s infinite ease-in-out;
                    border-radius: 6px;
                }
            `}</style>
            {cards.map((_, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '380px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                >
                    {/* Image Skeleton */}
                    <div className="skeleton-box" style={{ width: '100%', height: '220px' }} />
                    
                    {/* Content Skeleton */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                        <div className="skeleton-box" style={{ width: '70%', height: '18px' }} />
                        <div className="skeleton-box" style={{ width: '90%', height: '14px' }} />
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="skeleton-box" style={{ width: '40%', height: '20px' }} />
                            <div className="skeleton-box" style={{ width: '30%', height: '32px', borderRadius: '20px' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeleton;
