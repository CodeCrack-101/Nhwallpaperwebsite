/**
 * Infinite Product Grid Component
 * Location: frontend/src/components/Allproduct/InfiniteProductGrid.jsx
 * Description: Renders product catalog grids using infinite scroll batch loading.
 *              Initially displays 12 items and loads subsequent batches when user scrolls
 *              near the bottom, showing Mosaic loader + Skeleton placeholders.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mosaic } from 'react-loading-indicators';
import ImageLoader from '../common/ImageLoader';
import ProductSkeleton from '../common/ProductSkeleton';
import './CategoryProducts.css';

const BATCH_SIZE = 12;

const InfiniteProductGrid = ({ 
    products = [], 
    emptyMessage = "No products found." 
}) => {
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef(null);

    // Reset batch count when the underlying product list/filter changes
    useEffect(() => {
        setVisibleCount(BATCH_SIZE);
        setIsLoadingMore(false);
    }, [products]);

    const loadMoreProducts = useCallback(() => {
        if (isLoadingMore || visibleCount >= products.length) return;

        setIsLoadingMore(true);

        // Simulate smooth async batch resolution to show Mosaic indicator & prevent UI jump
        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, products.length));
            setIsLoadingMore(false);
        }, 400);
    }, [isLoadingMore, visibleCount, products.length]);

    useEffect(() => {
        const sentinel = observerTarget.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && visibleCount < products.length && !isLoadingMore) {
                    loadMoreProducts();
                }
            },
            {
                root: null,
                rootMargin: '250px', // Trigger before hitting exact page bottom
                threshold: 0.1
            }
        );

        observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [loadMoreProducts, visibleCount, products.length, isLoadingMore]);

    if (!products || products.length === 0) {
        return <div className="category-no-results">{emptyMessage}</div>;
    }

    const currentBatch = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    return (
        <div style={{ width: '100%' }}>
            {/* Main Product Cards Grid */}
            <div className="category-products-grid">
                {currentBatch.map((product) => (
                    <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        className="category-product-card"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="category-product-image" style={{ position: 'relative', overflow: 'hidden' }}>
                            <ImageLoader
                                src={product.img}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                containerStyle={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        
                        <div className="category-product-body">
                            <div>
                                <h3 className="category-product-title">
                                    {product.name}
                                </h3>
                                <p className="category-product-desc">
                                    {product.patternno}
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

            {/* Skeleton Cards + Mosaic Loader while batch loading */}
            {isLoadingMore && (
                <div style={{ marginTop: '30px' }}>
                    <ProductSkeleton count={4} columns="repeat(auto-fill, minmax(250px, 1fr))" />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '30px 0',
                        gap: '12px'
                    }}>
                        <Mosaic color="#111511" size="medium" text="" textColor="" />
                        <span style={{ fontSize: '13px', color: '#666', fontFamily: "'Poppins', sans-serif" }}>
                            Loading more products...
                        </span>
                    </div>
                </div>
            )}

            {/* Sentinel element observed by IntersectionObserver */}
            {hasMore && !isLoadingMore && (
                <div 
                    ref={observerTarget} 
                    style={{ 
                        height: '40px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: '20px' 
                    }} 
                >
                    <Mosaic color="#111511" size="small" text="" textColor="" />
                </div>
            )}
        </div>
    );
};

export default InfiniteProductGrid;
