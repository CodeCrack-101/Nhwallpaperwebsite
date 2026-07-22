/**
 * Section Loader Component
 * Location: frontend/src/components/common/SectionLoader.jsx
 * Description: Section-level loading container displaying the Mosaic loader
 *              for component sections, catalog tabs, and dynamic modules.
 */

import React from 'react';
import { Mosaic } from 'react-loading-indicators';

const SectionLoader = ({ minHeight = '250px', text = '' }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight,
            width: '100%',
            padding: '30px 20px',
            boxSizing: 'border-box',
            animation: 'fadeInSectionLoader 0.25s ease-out'
        }}>
            <style>{`
                @keyframes fadeInSectionLoader {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <Mosaic color="#111511" size="medium" text="" textColor="" />
            {text && (
                <span style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#666',
                    fontFamily: "'Poppins', sans-serif"
                }}>
                    {text}
                </span>
            )}
        </div>
    );
};

export default SectionLoader;
