import React from 'react';
import { FiEdit3 } from 'react-icons/fi';
import './Google.css';

const feedbacks = [
  {
    id: 1,
    name: 'Robert Karmazov',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    comment: 'Auctor magnis proin vitae laoreet ultrices ultricies diam. Sed duis mattis cras lacus donec. Aliquam lorem ipsum dolor sit amet.'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    comment: 'Redefine living spaces perfectly! Premium material and completely flawless experience across the execution dashboard.'
  },
  {
    id: 3,
    name: 'Arjun Mehta',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    comment: 'Durable and beautiful premium design formats. The installation workflow was highly professional.'
  }
];

const Google = () => {
  // ⚠️ APNI GOOGLE BUSINESS PLACE ID YAHAN PASTE KAREIN
  const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_BUSINESS_PLACE_ID";

  return (
    <div className="google-reviews-container">
      
      {/* ================= TOP METRICS STATS DASHBOARD ================= */}
      <div className="metrics-dashboard">
        <div className="breakdown-card">
          <div className="bar-row">
            <span className="star-label">FIVE</span>
            <div className="progress-track"><div className="progress-fill fill-90"></div></div>
            <span className="count-label">989</span>
          </div>
          <div className="bar-row">
            <span className="star-label">FOUR</span>
            <div className="progress-track"><div className="progress-fill fill-75"></div></div>
            <span className="count-label">4.5K</span>
          </div>
          <div className="bar-row">
            <span className="star-label">THREE</span>
            <div className="progress-track"><div className="progress-fill fill-15"></div></div>
            <span className="count-label">50</span>
          </div>
          <div className="bar-row">
            <span className="star-label">TWO</span>
            <div className="progress-track"><div className="progress-fill fill-10"></div></div>
            <span className="count-label">16</span>
          </div>
          <div className="bar-row">
            <span className="star-label">ONE</span>
            <div className="progress-track"><div className="progress-fill fill-5"></div></div>
            <span className="count-label">8</span>
          </div>
        </div>

        <div className="score-card">
          <h1 className="average-number">4.3</h1>
          <div className="score-stars">★★★★★</div>
          <p className="ratings-total">50 Ratings</p>
        </div>
      </div>

      {/* ================= MAIN SPLIT GRID BLOCK ================= */}
      <div className="reviews-split-grid">
        
        {/* Left Side: Recent Feedbacks Feed */}
        <div className="feedbacks-column">
          <h2 className="section-title">Recent Feedbacks</h2>
          <div className="feedbacks-stack">
            {feedbacks.map((item) => (
              <div key={item.id} className="feedback-item-card">
                <img src={item.avatar} alt={item.name} className="user-avatar" />
                <div className="feedback-body">
                  <div className="feedback-head-row">
                    <h4 className="user-name">{item.name}</h4>
                    <div className="card-stars">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                  </div>
                  <p className="user-comment">{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Clean Call-to-Action Box with GMB Review Button */}
        <div className="action-column">
          <div className="gmb-cta-box">
            <h2 className="cta-title">Share Your Experience</h2>
            <p className="cta-desc">
              Your feedback helps us grow. Click below to write a review directly on our Google Business Profile page.
            </p>
            <a 
              href={GOOGLE_REVIEW_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="gmb-review-btn"
            >
              <FiEdit3 className="btn-icon" />
              Write a Review on Google
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Google;