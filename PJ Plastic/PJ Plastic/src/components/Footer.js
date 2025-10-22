import React from "react";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PJ Plastic (Pvt) Ltd</h3>
            <p>Delivering Quality Plastic Solutions Since 2019</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p><i className="fas fa-map-marker-alt"></i> Ratnapura, Sri Lanka</p>
            <p><i className="fas fa-phone"></i> Hotline: +94 45 226 4998</p> {/* Added "Hotline:" */}
            <p><i className="fas fa-envelope"></i> info@pjplastic.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PJ Plastic (Pvt) Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;