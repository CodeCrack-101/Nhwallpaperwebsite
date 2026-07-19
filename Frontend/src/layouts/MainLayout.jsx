/**
 * Main Layout Component File
 * Location: frontend/src/layouts/MainLayout.jsx
 * Description: Embeds standard Navbar and Footer containers surrounding
 *              the primary React Router <Outlet> for page contents.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top Navigation Header - Har page par common rahega */}
            <Navbar />

            {/* Main Content Area - Renders active route component via Outlet */}
            <main style={{ flex: '1 0 auto' }}>
                <Outlet />
            </main>

            {/* Bottom Global Footer - Har page par common rahega */}
            <Footer />
        </div>
    );
};

export default MainLayout;