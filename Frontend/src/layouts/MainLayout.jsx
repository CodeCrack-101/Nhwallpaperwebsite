/**
 * Main Layout Component File
 * Location: frontend/src/layouts/MainLayout.jsx
 * Description: Embeds standard Navbar and Footer containers surrounding
 *              the primary React Router <Outlet> for page contents.
 */
import BestProduct from '../components/Allproduct/BestProduct';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import BookSlider from '../components/Slider/ProductSlider';
import ImageSlider from '../components/Slider/ImageSlider';
import Product from '../components/Products/Product';
// import BestSellers from '../components/Allproduct/BestSellers';
const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top Navigation Header */}
            <Navbar />

            {/* Main Content Area */}
            <main style={{ flex: '1 0 auto' }}>
                <Outlet />
            </main>
            <BookSlider/>
            <ImageSlider/>
            <Product/>
             <BestProduct />

            <Footer />
        </div>
    );
};

export default MainLayout;
