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
            {/* Top Navigation Header */}
            <Navbar />

            {/* Main Content Area */}
            <main style={{ flex: '1 0 auto' }}>
                <Outlet />
            </main>

            {/* Bottom Brand Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;
