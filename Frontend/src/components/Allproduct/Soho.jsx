import React, { useState, useEffect, useCallback, useMemo } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { MessageSquare, PlayCircle, Search, X } from "lucide-react";
import "./Boos-chair.css";

/* ------------------ DEFAULT DATA ------------------ */

const DEFAULT_BAR_CHAIR_PRICE = "Contact for Best Deal";

const DEFAULT_BAR_CHAIR_DESCRIPTION =
  "Inspired by contemporary urban aesthetics, the Soho wallpaper features bold textures and stylish patterns that bring a modern designer look to any space. Its premium washable surface ensures long-lasting beauty, making it ideal for living rooms, feature walls, and commercial interiors.";
/* ------------------ PRODUCTS ------------------ */
const allProducts = [
  {
    id: 1,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525301",
    imageUrls: ["/sh1.png", "/sh2.png", "/All.png"],
  },
  {
    id: 2,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525302",
    imageUrls: ["/sh3.png", "/sh4.png", "/All.png"],
  },  
  {
    id: 3,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525303",
    imageUrls: ["/sh5.png", "/sh6.png", "/All.png"],
  },
  {
    id: 4,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525304",
    imageUrls: ["/sh7.png", "/sh8.png", "/All.png"],
  },
  {
    id: 5,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525305",
    imageUrls: ["/sh9.png", "/sh10.png", "/All.png"],
  },
  {
    id: 6,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525306",
    imageUrls: ["/sh11.png", "/sh12.png", "/All.png"],
  },
  {
    id: 7,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525307",
    imageUrls: ["/sh13.png", "/sh14.png", "/All.png"],
  },
  {
    id: 8,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525308",
    imageUrls: ["/sh15.png", "/sh16.png", "/All.png"],
  },
  {
    id: 9,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525309",
    imageUrls: ["/sh17.png", "/sh18.png", "/All.png"],
  },
  {
    id: 10,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253010",
    imageUrls: ["/sh19.png", "/sh20.png", "/All.png"],
  },
  {
    id: 11,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253011",
    imageUrls: ["/sh21.png", "/sh22.png", "/All.png"],
  },
  {
    id: 12,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253012",
    imageUrls: ["/sh23.png", "/sh24.png", "/All.png"],
  },
  {
    id: 13,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253013",
    imageUrls: ["/sh25.png", "/sh26.png", "/All.png"],
  },
  {
    id: 14,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253014",
    imageUrls: ["/sh27.png", "/sh28.png", "/All.png"],
  },
 
  {
    id: 15,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253015",
    imageUrls: ["/sh29.png", "/sh30.png", "/All.png"],
  },
 
  {
    id: 16,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253016",
    imageUrls: ["/sh31.png", "/sh32.png", "/All.png"],
  },
  {
    id: 17,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253017",
    imageUrls: ["/sh33.png", "/sh34.png", "/All.png"],
  },
  {
    id: 18,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253018",
    imageUrls: ["/sh35.png", "/sh36.png", "/All.png"],
  },
  {
    id: 19,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253019",
    imageUrls: ["/sh37.png", "/sh38.png", "/All.png"],
  },
  {
    id: 20,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253020",
    imageUrls: ["/sh39.png", "/sh40.png", "/All.png"],
  },
 
  {
    id: 21,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253021",
    imageUrls: ["/sh41.png", "/sh42.png", "/All.png"],
  },
  {
    id: 22,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253022",
    imageUrls: ["/sh43.png", "/sh44.png", "/All.png"],
  },
  {
    id: 23,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253023",
    imageUrls: ["/sh45.png", "/sh46.png", "/All.png"],
  },
  {
    id: 24,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "5253024",
    imageUrls: ["/sh47.png", "/sh48.png", "/All.png"],
  },
  {
    id: 25,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525325",
    imageUrls: ["/sh49.png", "/sh50.png", "/All.png"],
  },
  {
    id: 26,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525326",
    imageUrls: ["/sh51.png", "/sh52.png", "/All.png"],
  },
  {
    id: 27,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525327",
    imageUrls: ["/sh53.png", "/sh54.png", "/All.png"],
  },
  {
    id: 28,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525328",
    imageUrls: ["/sh55.png", "/sh56.png", "/All.png"],
  },
  {
    id: 29,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525329",
    imageUrls: ["/sh57.png", "/sh58.png", "/All.png"],
  },
  {
    id: 30,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525330",
    imageUrls: ["/sh59.png", "/sh60.png", "/All.png"],
  },
  {
    id: 31,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525331",
    imageUrls: ["/sh61.png", "/sh62.png", "/All.png"],
  },
  {
    id: 32,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525332",
    imageUrls: ["/sh63.png", "/sh64.png", "/All.png"],
  },
  {
    id: 33,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525333",
    imageUrls: ["/sh65.png", "/sh66.png", "/All.png"],
  },
  {
    id: 34,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525334",
    imageUrls: ["/sh67.png", "/sh68.png", "/All.png"],
  },
  {
    id: 35,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525335",
    imageUrls: ["/sh69.png", "/sh70.png", "/All.png"],
  },
  {
    id: 36,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525336",
    imageUrls: ["/sh71.png", "/sh72.png", "/All.png"],
  },
  {
    id: 37,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525337",
    imageUrls: ["/sh73.png", "/sh74.png", "/All.png"],
  },
  {
    id: 38,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525338",
    imageUrls: ["/sh75.png", "/sh76.png", "/All.png"],
  },
  {
    id: 39,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525339",
    imageUrls: ["/sh77.png", "/sh78.png", "/All.png"],
  },
  {
    id: 40,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525340",
    imageUrls: ["/sh79.png", "/sh80.png", "/All.png"],
  },
  {
    id: 41,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525341",
    imageUrls: ["/sh81.png", "/sh82.png", "/All.png"],
  },
  {
    id: 42,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525342",
    imageUrls: ["/sh83.png", "/sh84.png", "/All.png"],
  },
  {
    id: 43,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525343",
    imageUrls: ["/sh85.png", "/sh86.png", "/All.png"],
  },
  {
    id: 44,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525344",
    imageUrls: ["/sh87.png", "/sh88.png", "/All.png"],
  },
  {
    id: 45,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525345",
    imageUrls: ["/sh89.png", "/sh90.png", "/All.png"],
  },
  {
    id: 46,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525346",
    imageUrls: ["/sh91.png", "/sh92.png", "/All.png"],
  },
  {
    id: 47,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525347",
    imageUrls: ["/sh93.png", "/sh94.png", "/All.png"],
  },
  {
    id: 48,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525348",
    imageUrls: ["/sh95.png", "/sh96.png", "/All.png"],
  },
  {
    id: 49,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525349",
    imageUrls: ["/sh97.png", "/sh98.png", "/All.png"],
  },
  {
    id: 50,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525350",
    imageUrls: ["/sh99.png", "/sh100.png", "/All.png"],
  },
  {
    id: 51,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525351",
    imageUrls: ["/sh101.png", "/sh102.png", "/All.png"],
  },
  {
    id: 52,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525352",
    imageUrls: ["/sh103.png", "/sh104.png", "/All.png"],
  },
  {
    id: 53,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525353",
    imageUrls: ["/sh105.png", "/sh106.png", "/All.png"],
  },
  {
    id: 54,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525354",
    imageUrls: ["/sh107.png", "/sh108.png", "/All.png"],
  },
  {
    id: 55,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525355",
    imageUrls: ["/sh109.png", "/sh110.png", "/All.png"],
  },
  {
    id: 56,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525356",
    imageUrls: ["/sh111.png", "/sh112.png", "/All.png"],
  },
  {
    id: 57,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525357",
    imageUrls: ["/sh113.png", "/sh114.png", "/All.png"],
  },
  {
    id: 58,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525358",
    imageUrls: ["/sh115.png", "/sh116.png", "/All.png"],
  },
  {
    id: 59,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525359",
    imageUrls: ["/sh117.png", "/sh118.png", "/All.png"],
  },
  {
    id: 60,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525360",
    imageUrls: ["/sh119.png", "/sh120.png", "/All.png"],
  },
  {
    id: 61,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525361",
    imageUrls: ["/sh121.png", "/sh122.png", "/All.png"],
  },
  {
    id: 62,
    name: "Soho",
    price: DEFAULT_BAR_CHAIR_PRICE,
    description: DEFAULT_BAR_CHAIR_DESCRIPTION,
    category: "525362",
    imageUrls: ["/sh123.png", "/sh124.png", "/All.png"],
  },

];

/* ------------------ IMAGE SLIDER ------------------ */

const ProductImageSlider = ({ images, productName, onImageChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages =
    images && images.length > 0 ? images : ["/placeholder.png"];

  useEffect(() => {
    onImageChange(safeImages[activeIndex]);
  }, [activeIndex, safeImages, onImageChange]);

  return (
    <div className="slider-container">
      <div className="main-stage">
        <img
          src={safeImages[activeIndex]}
          alt={`${productName} view ${activeIndex + 1}`}
          className="slider-main-img"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>

      <div className="thumbnail-row">
        <div className="play-btn-thumb">
          <PlayCircle size={20} color="#2F3E30" />
        </div>

        {safeImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="thumb"
            className={`thumb-img ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

/* ------------------ PRODUCT DETAIL ------------------ */

const ProductDetail = ({ product }) => {

  const whatsappNumber = "919920395733";
  const [selectedImage, setSelectedImage] = useState(product.imageUrls[0]);

  const productImageUrl = `${window.location.origin}${selectedImage}`;

  const whatsappMessage = `
Hello, I am interested in this wallpaper.

Product Name: ${product.name}
Product Code: ${product.category}
Product ID: ${product.id}

Product Image:
${productImageUrl}
`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="product-detail-page">
      <div className="detail-wrapper">

        <ProductImageSlider
          images={product.imageUrls}
          productName={product.name}
          onImageChange={setSelectedImage}
        />

        <div className="text-content">
          <div className="detail-category">Product Description</div>

          <p className="detail-description">{product.category}</p>
          <p className="detail-description">{product.name}</p>
          <p className="detail-description">{product.description}</p>

          <div className="detail-price-box">
            <div className="detail-price">
              <del>â‚¹1500 - â‚¹2000</del> {product.price}
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-enquiry"
          >
            <MessageSquare size={18} /> Enquiry on WhatsApp
          </a>

        </div>
      </div>
    </div>
  );
};

/* ------------------ PRODUCT CARD ------------------ */

const ProductCard = ({ product, onSelectProduct }) => {

  const [isHovered, setIsHovered] = useState(false);

  const currentImage =
    isHovered && product.imageUrls.length > 1
      ? product.imageUrls[1]
      : product.imageUrls[0];

  return (
    <div
      className="product-card"
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-wrapper">
        <img
          src={currentImage}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <button className="view-details-button">
          View Details
        </button>
      </div>
    </div>
  );
};

/* ------------------ PRODUCT GRID ------------------ */

const ProductGrid = ({ products, onSelectProduct }) => {

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="product-grid-page">

      <h1 className="catalog-heading">Soho</h1>

      {/* SEARCH BAR */}

      <div className="search-wrapper">
        <Search size={18} className="search-icon" />

        <input
          type="text"
          placeholder="Search by Product ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {searchTerm && (
          <X
            size={18}
            className="clear-icon"
            onClick={() => setSearchTerm("")}
          />
        )}
      </div>

      <div className="product-grid-container">

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.category}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))
        ) : (
          <div className="no-results">
            No products found.
          </div>
        )}

      </div>
    </div>
  );
};

/* ------------------ MAIN PAGE ------------------ */

const Soho = () => {

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="app-container">

        <Navbar />

        <main className="app-main">

          {selectedProduct ? (
            <ProductDetail product={selectedProduct} />
          ) : (
            <ProductGrid
              products={allProducts}
              onSelectProduct={handleSelectProduct}
            />
          )}

        </main>

      </div>

      <Footer />
    </>
  );
};

export default Soho;