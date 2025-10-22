import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Add this import
import { useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import './Header.css';
import AuthModal from './AuthModal';
import logo from '../assets/images/logo.png';

function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart(); // Add this to get cart count
  const location = useLocation();
  const navigate = useNavigate(); // Add this for navigation

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  const handleCartClick = () => {
    navigate('/cart'); // Redirect to cart page
  };

  const goAdmin = () => {
    navigate('/admin');
  };

  return (
    <>
      <header className="rn-header">
        <nav className="navbar">
          <div className="nav-brand">
            <a href="/" className="brand-link">
              <span className="brand-text"><img src={logo} alt="PJ Plastic Logo" className="logo-image" /></span>
            </a>
          </div>
          
          <ul className="nav-menu">
            <li>
              <a href="/" className={isActiveTab('/') ? 'active' : ''}>
                Home
              </a>
            </li>
            <li>
              <a href="/products" className={isActiveTab('/products') ? 'active' : ''}>
                Products
              </a>
            </li>
            <li>
              <a href="/blogs" className={isActiveTab('/blogs') ? 'active' : ''}>
                Blogs
              </a>
            </li>
            <li>
              <a href="/contact" className={isActiveTab('/contact') ? 'active' : ''}>
                Contact
              </a>
            </li>
            <li>
              <a href="/about" className={isActiveTab('/about') ? 'active' : ''}>
                About
              </a>
            </li>
            <li className="search-item">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search" />
              </div>
            </li>
          </ul>
          
          <div className="nav-auth">
            {currentUser ? (
              <div className="user-menu">
                <button 
                  onClick={handleCartClick}
                  className="auth-btn cart-btn"
                  title="View Cart"
                >
                  🛒 Cart {cartCount > 0 && `(${cartCount})`}
                </button>
                {currentUser.isAdmin && (
                  <button onClick={goAdmin} className="auth-btn admin-btn">Admin</button>
                )}
                <span className="welcome-text">{currentUser.email || currentUser.username}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="auth-btn login-btn"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="auth-btn signup-btn"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

export default Header;