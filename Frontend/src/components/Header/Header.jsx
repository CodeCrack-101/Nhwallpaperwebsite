import { Link } from "react-router-dom";
import "./Header.css";

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

      {/* Featured Categories */}
      {/* <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find the perfect theme for every room in your home</p>
        </div>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-image nature-img"></div>
            <div className="category-info">
              <h3>Nature</h3>
              <p>Tropical leaves & botanical designs</p>
              <Link to="/shop?category=Nature" className="category-link">Browse &rarr;</Link>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image space-img"></div>
            <div className="category-info">
              <h3>Space</h3>
              <p>Cosmic nebulae & star fields</p>
              <Link to="/shop?category=Space" className="category-link">Browse &rarr;</Link>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image abstract-img"></div>
            <div className="category-info">
              <h3>Abstract</h3>
              <p>Textured marble & geometric forms</p>
              <Link to="/shop?category=Abstract" className="category-link">Browse &rarr;</Link>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default Header;
