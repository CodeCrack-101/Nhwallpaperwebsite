/**
 * Loading Context Provider File
 * Location: frontend/src/context/LoadingContext.jsx
 * Description: Manages global API loading state, route transitions, and granular action loaders.
 *              Allows components across the app to query API loading status and show Mosaic indicators.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import PageLoader from '../components/common/PageLoader';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    // Count of active network/API calls
    const [activeRequests, setActiveRequests] = useState(0);
    // Track key-specific loading states e.g. { login: true, cart: false, checkout: true }
    const [actionLoaders, setActionLoaders] = useState({});
    // Route transition state
    const [isNavigating, setIsNavigating] = useState(false);

    // Listen to global axios events to keep activeRequests accurate
    React.useEffect(() => {
        const handleStart = () => setActiveRequests(prev => prev + 1);
        const handleEnd = () => setActiveRequests(prev => Math.max(0, prev - 1));

        window.addEventListener('api-loading-start', handleStart);
        window.addEventListener('api-loading-end', handleEnd);

        return () => {
            window.removeEventListener('api-loading-start', handleStart);
            window.removeEventListener('api-loading-end', handleEnd);
        };
    }, []);

    /**
     * Start global network loader counter
     */
    const startLoading = useCallback(() => {
        setActiveRequests(prev => prev + 1);
    }, []);

    /**
     * Stop global network loader counter
     */
    const stopLoading = useCallback(() => {
        setActiveRequests(prev => Math.max(0, prev - 1));
    }, []);

    /**
     * Set loading status for a specific key (e.g. 'login', 'cart-add-101', 'checkout')
     */
    const setKeyLoading = useCallback((key, isLoading) => {
        setActionLoaders(prev => ({
            ...prev,
            [key]: Boolean(isLoading)
        }));
    }, []);

    /**
     * Check if a specific key is currently loading
     */
    const isKeyLoading = useCallback((key) => {
        return Boolean(actionLoaders[key]);
    }, [actionLoaders]);

    /**
     * Trigger route navigation loading
     */
    const startNavigation = useCallback(() => {
        setIsNavigating(true);
    }, []);

    const stopNavigation = useCallback(() => {
        setIsNavigating(false);
    }, []);

    const value = {
        isGlobalLoading: activeRequests > 0 || isNavigating,
        activeRequests,
        isNavigating,
        actionLoaders,
        startLoading,
        stopLoading,
        setKeyLoading,
        isKeyLoading,
        startNavigation,
        stopNavigation
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {value.isGlobalLoading && <PageLoader fullScreen={true} />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
