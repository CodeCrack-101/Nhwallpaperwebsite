import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiHeart,
    FiUser,
    FiShoppingBag,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItemCount, wishlist } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <header className="navbar">

                {/* Mobile Menu Button */}
                <div
                    className="menu-btn"
                    onClick={() => setMenuOpen(true)}
                >
                    <FiMenu />
                </div>

                {/* Left Menu */}
                <nav className="left-nav">
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/collections">Collections</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                {/* Center Logo */}
                <div className="logo">
                    <Link to="/">
                        <span>WALL</span>ART
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="right-nav">
                    <div className="desktop-icons">
                        {user ? (
                            <>
                                <Link to="/wishlist" title="Wishlist" className="nav-icon-link">
                                    <FiHeart />
                                    {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                                </Link>
                                <Link to="/profile" title="Profile" className="nav-icon-link">
                                    <FiUser />
                                </Link>
                                <Link to="/orders" title="Orders" className="nav-text-link">
                                    Orders
                                </Link>
                                <Link to="/cart" title="Cart" className="nav-icon-link cart">
                                    <FiShoppingBag />
                                    {cartItemCount > 0 && <span>{cartItemCount}</span>}
                                </Link>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" title="Login" className="nav-icon-link">
                                <FiUser />
                            </Link>
                        )}
                    </div>
                </div>

            </header>

            {/* Overlay */}
            <div
                className={menuOpen ? "overlay active" : "overlay"}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={menuOpen ? "sidebar active" : "sidebar"}>

                <div
                    className="close-btn"
                    onClick={() => setMenuOpen(false)}
                >
                    <FiX />
                </div>

                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                <Link to="/collections" onClick={() => setMenuOpen(false)}>Collections</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

                {user ? (
                    <>
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                        <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                        <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartItemCount})</Link>
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="sidebar-logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                )}

            </aside>
        </>
    );
}

export default Navbar;