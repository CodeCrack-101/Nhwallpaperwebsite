/**
 * Button Loader Component
 * Location: frontend/src/components/common/ButtonLoader.jsx
 * Description: Renders the Mosaic indicator inside action buttons during API requests,
 *              disabling the button to prevent duplicate submissions.
 */

import React from 'react';

const ButtonLoader = ({
    children,
    loading = false,
    disabled = false,
    className = '',
    style = {},
    type = 'button',
    onClick,
    ...rest
}) => {
    return (
        <button
            type={type}
            className={className}
            disabled={disabled || loading}
            onClick={onClick}
            style={{
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                ...style
            }}
            {...rest}
        >
            {loading ? 'Please wait...' : children}
        </button>
    );
};

export default ButtonLoader;
