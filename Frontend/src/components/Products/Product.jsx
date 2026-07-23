import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from 'react-icons/fi';
import './Product.css';

const products = [
  {
    id: 1,
    name: '',
    price: '499Rs',
    deliveryBadge: 'Fast Delivery',
    tags: ['Washable', 'Premium', 'DustProof'],
    image: '',
    link: '#',
  },
  {
    id: 2,
    name: '',
    price: '70Rs.',
    deliveryBadge: 'Fast Delivery',
    tags: ['Fresh', 'Milk', 'Honey'],
    image: '',
    link: '#',
  },
  {
    id: 3,
    name: 'Mango Smoothie',
    price: '60Rs.',
    deliveryBadge: 'Fast Delivery',
    tags: ['Mango', 'Yogurt', 'Ice'],
    image: '',
    link: '#',
  },
  {
    id: 4,
    name: 'Berry Blast',
    price: '80Rs.',
    deliveryBadge: 'Fast Delivery',
    tags: ['Berries', 'Ice', 'Mint'],
    image: '',
    link: '#',
  },
  {
    id: 5,
    name: 'Green Detox',
    price: '65Rs.',
    deliveryBadge: 'Fast Delivery',
    tags: ['Spinach', 'Apple', 'Lemon'],
    image: '',
    link: '#',
  },
  {
    id: 6,
    name: 'Citrus Fresh',
    price: '55Rs.',
    deliveryBadge: 'Fast Delivery',
    tags: ['Orange', 'Mint', 'Ice'],
    image: '',
    link: '#',
  }
];

const ProductSlider = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="product-slider-wrapper">
      <h2 className="slider-header-title">Trending Wallpaper</h2>

      <div className="slider-container">
        {/* Left Navigation Arrow */}
        <button
          className="nav-arrow nav-arrow-left"
          onClick={() => scroll('left')}
          aria-label="Previous Products"
        >
          <FiChevronLeft />
        </button>

        {/* Right Navigation Arrow */}
        <button
          className="nav-arrow nav-arrow-right"
          onClick={() => scroll('right')}
          aria-label="Next Products"
        >
          <FiChevronRight />
        </button>

        {/* Card Track Container */}
        <div className="product-track" ref={scrollRef}>
          {products.map((item) => (
            <div key={item.id} className="juice-card">
              {/* Top Light-Green Inner Box */}
              <div className="card-inner-top">
                <div className="image-container">
                  <img src={item.image} alt={item.name} className="product-img" />
                </div>
                <div className="delivery-badge">{item.deliveryBadge}</div>
              </div>

              {/* Bottom Dark Section */}
              <div className="card-bottom-info">
                <div className="left-info">
                  <h3 className="product-title">{item.name}</h3>
                  <div className="tags-wrapper">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vertical Divider Line */}
                <div className="vertical-divider"></div>

                <div className="right-info">
                  <div className="product-price">{item.price}</div>
                  <a href={item.link} className="order-link">
                    Order Now <FiArrowUpRight className="link-arrow" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;