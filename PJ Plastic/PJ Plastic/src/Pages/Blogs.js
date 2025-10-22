import React from "react";
//import Header from "../components/Header";
//import Footer from "../components/Footer";
import './Blogs.css';

function Blogs() {
  return (
    <div className="blogs-page">
    
      
      <section className="blogs-hero section section-light">
        <div className="container">
          <h1>Our Blogs</h1>
          <p className="hero-subtitle">Stay updated with the latest news and insights from PJ Plastic</p>
        </div>
      </section>

      <section className="blogs-cta section">
        <div className="container">
          <div className="cta-content">
            <h2>Blogs Coming Soon</h2>
            <p>We're preparing valuable content for you. Please check back later.</p>
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default Blogs;