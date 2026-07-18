/**
 * Auth Hook File
 * Location: frontend/src/hooks/useAuth.js
 * Description: Custom React Hook to simplify AuthContext consumption.
 */


import { useAuth as useContextAuth } from '../context/AuthContext';

/**
 * Custom hook to utilize auth state
 */
export const useAuth = () => {
    return useContextAuth();
};

export default useAuth;
