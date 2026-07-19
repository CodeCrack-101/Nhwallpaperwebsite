import React from 'react';
import { Link } from "react-router-dom";
import "./Header.css";

// Home Page ke baaki child components ko import kiya
import BookSlider from '../Slider/ProductSlider';
import ImageSlider from '../Slider/ImageSlider';
import Product from '../Products/Product';
import BestProduct from '../Allproduct/BestProduct';
import Google from '../GoogleReview/Google';

function Header() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-subtitle">Premium Wall Art & Wallpapers</span>
          <h1 className="hero-title">
            Redefine Your <span>Living Spaces</span>
          </h1>
          <p className="hero-description">
            Discover our curated collections of luxury textured wallpapers, celestial dreamscapes, and botanical designs handcrafted to breathe personality into your home.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary">
              Explore Collection
            </Link>
            <Link to="/collections" className="btn-secondary">
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOME SPECIFIC COMPONENTS ================= */}
      {/* Yeh saare sections ab Hero section ke thik niche render honge */}
      <BookSlider />
      <ImageSlider />
      <Product />
      <BestProduct />
      <Google/>
    </div>
  );
}

export default Header;