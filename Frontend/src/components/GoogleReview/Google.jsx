import React, { useState, useEffect, useRef } from 'react';
import './Google.css';

const Google = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const googleScriptLoaded = useRef(false);

  // ⚠️ APNI DETAILS YAHAN DAALEIN
  const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 
  const GOOGLE_PLACE_ID = "ChIJvYNY7aDJ5zsRiOXCvUvjijc"; 

  useEffect(() => {
    // 1. Google Maps Script ko dynamically load karne ka function
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initPlacesService();
        return;
      }

      if (googleScriptLoaded.current) return;
      googleScriptLoaded.current = true;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initPlacesService();
      script.onerror = () => {
        setError("Failed to load Google Maps SDK.");
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    // 2. Google Places Service se raw reviews fetch karne ka function
    const initPlacesService = () => {
      try {
        // Ek dummy element create karte hain kyunki PlacesService ko DOM node chahiye hota hai
        const dummyElement = document.createElement('div');
        const service = new window.google.maps.places.PlacesService(dummyElement);

        service.getDetails(
          {
            placeId: GOOGLE_PLACE_ID,
            fields: ['reviews', 'rating'], // Sirf zaroori fields pull karenge
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place.reviews) {
              // Google by default top 5 relevant reviews return karta hai
              setReviews(place.reviews);
            } else {
              setError("No reviews found or API status failed.");
            }
            setLoading(false);
          }
        );
      } catch (err) {
        setError("Error initializing Google Places Service.");
        setLoading(false);
      }
    };

    loadGoogleMapsScript();
  }, []);

  if (loading) {
    return (
      <div className="reviews-loading">
        <p>Fetching live reviews from Google...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="google-reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">What Our <span>Customers Say</span></h2>
        <p className="reviews-subtitle">Real-time reviews synced straight from our Google Business Profile.</p>
      </div>

      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            {/* Reviewer Header */}
            <div className="reviewer-profile">
              <img 
                src={review.profile_photo_url} 
                alt={review.author_name} 
                className="reviewer-avatar"
                referrerPolicy="no-referrer"
              />
              <div className="reviewer-meta">
                <h4 className="reviewer-name">{review.author_name}</h4>
                <span className="review-time">{review.relative_time_description}</span>
              </div>
            </div>

            {/* Dynamic Gold Stars */}
            <div className="review-stars">
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>

            {/* Review Text Comments */}
            <p className="review-text">"{review.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Google;