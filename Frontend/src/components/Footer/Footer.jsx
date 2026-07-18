import {
    FiMapPin,
    FiPhoneCall,
    FiMail,
    FiFacebook,
    FiInstagram,
    FiTwitter,
    FiSend,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            {/* ================= Top ================= */}

            <div className="footer-top">

                <div className="top-box">
                    <FiMapPin className="top-icon" />

                    <div>
                        <h4>Find Us</h4>
                        <p>Mumbai, Maharashtra, India</p>
                    </div>
                </div>

                <div className="top-box">
                    <FiPhoneCall className="top-icon" />

                    <div>
                        <h4>Call Us</h4>
                        <p>+91 9876543210</p>
                    </div>
                </div>

                <div className="top-box">
                    <FiMail className="top-icon" />

                    <div>
                        <h4>Mail Us</h4>
                        <p>support@yourstore.com</p>
                    </div>
                </div>

            </div>

            <hr />

            {/* ================= Bottom ================= */}

            <div className="footer-main">

                {/* Company */}

                <div className="footer-about">

                    <h2 className="logo">
                        NH<span>Store</span>
                    </h2>

                    <p>
                        We provide premium wallpapers with the best quality,
                        affordable pricing and fast delivery across India.
                    </p>

                    <h3>Follow Us</h3>

                    <div className="social-icons">

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiFacebook />
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiInstagram />
                        </a>

                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiTwitter />
                        </a>

                    </div>

                </div>

                {/* Links */}

                <div className="footer-links">

                    <h3>Useful Links</h3>

                    <div className="link-grid">

                        <div>

                            <Link to="/">Home</Link>

                            <Link to="/products">Products</Link>

                            <Link to="/about">About</Link>

                            <Link to="/contact">Contact</Link>

                        </div>

                        <div>

                            <Link to="/services">Services</Link>

                            <Link to="/gallery">Gallery</Link>

                            <Link to="/faq">FAQ</Link>

                            <Link to="/privacy">Privacy Policy</Link>

                        </div>

                    </div>

                </div>

                {/* Subscribe */}

                <div className="footer-subscribe">

                    <h3>Subscribe</h3>

                    <p>
                        Subscribe to get updates about new products and offers.
                    </p>

                    <div className="subscribe-box">

                        <input
                            type="email"
                            placeholder="Enter Your Email"
                        />

                        <button>
                            <FiSend />
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= Bottom Copyright ================= */}

            <div className="footer-copy">

                © {new Date().getFullYear()} NH Store.
                All Rights Reserved.

            </div>

        </footer>
    );
}

export default Footer;