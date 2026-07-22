/**
 * Global Page Loader Component
 * Location: frontend/src/components/common/PageLoader.jsx
 * Description: Renders the Mosaic loading indicator centered on screen or container
 *              with a smooth fade-in/fade-out animation.
 */

import React from 'react';
import { Mosaic } from 'react-loading-indicators';

const PageLoader = ({ fullScreen = true, message = '' }) => {
    const containerStyle = fullScreen
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            animation: 'fadeInPageLoader 0.3s ease-out forwards'
        }
        : {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            width: '100%',
            padding: '40px 0',
            animation: 'fadeInPageLoader 0.3s ease-out forwards'
        };

    return (
        <div className="page-loader-wrapper" style={containerStyle}>
            <style>{`
                @keyframes fadeInPageLoader {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
            <Mosaic color="#111511" size="medium" text="" textColor="" />
            {message && (
                <p style={{
                    marginTop: '16px',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: "'Poppins', sans-serif"
                }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default PageLoader;
