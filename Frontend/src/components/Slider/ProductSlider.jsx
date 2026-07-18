import React from "react";
import "./ProductSlider.css";

const BookSlider = () => {
  const books = [
    {
      id: 1,
      title: "Soho",
      desc: "Soho is One Of The Best Wallpaper Available Today.",
      image: "/soho.png",
      rating: 3,
    },
    {
      id: 2,
      title: "Sky",
      desc: "Sky Has A Vast Variety Of Premium Designs.",
      image: "/sky.png",
      rating: 4,
    },
    {
      id: 3,
      title: "Selfie Point",
      desc: "Best For Offices, Texture And Washable.",
      image: "/sp.png",
      rating: 3,
    },
    {
      id: 4,
      title: "Wall FLora",
      desc: "Best For Everywhere.",
      image: "/w.png",
      rating: 4,
    },
    {
      id: 5,
      title: "Wall FLora",
      desc: "Best For Everywhere.",
      image: "/t.png",
      rating: 4,
    },
    {
      id: 6,
      title: "Epic Walls",
      desc: "Best For Everywhere.",
      image: "/epic.png",
      rating: 4,
    },
  ];

  // Duplicate twice for perfect loop
  const duplicatedBooks = [...books, ...books];

  return (
    <div className="slider-wrapper">
      <div className="slider-header">
        <h2>Our Catalogue</h2>
        <p>
          We offer a vast variety of premium quality products. Much like our
          luxury wallpapers, these are all durable, washable, and designed to
          last.
        </p>
      </div>

      <div className="slider-containere">
        <div className="slider-tracking">
          {duplicatedBooks.map((book, index) => (
            <div key={index} className="book-cards">
              <div className="book-cover">
                <img src={book.image} alt={book.title} />
              </div>

              <div className="book-details">
                <div className="stars">
                  {"★".repeat(book.rating)}
                  {"☆".repeat(5 - book.rating)}
                </div>

                <h3 className="book-title">{book.title}</h3>
                <p className="book-desc">{book.desc}</p>

                <button className="buy-button">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BookSlider;