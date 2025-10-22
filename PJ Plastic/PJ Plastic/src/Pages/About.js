import React from "react";
//import Header from "../components/Header";
//import Footer from "../components/Footer";
import FactorySlideshow from "../components/FactorySlideshow"; // Add this import
import './About.css';

function About() {
  return (
    <div className="about-page">
      
      
      <section className="about-hero section section-light">
        <div className="container">
          <h1>About PJ Plastic</h1>
          <p className="hero-subtitle">Delivering Quality Plastic Solutions Since 2019</p>
        </div>
      </section>

      <section className="about-content section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Since 2019, PJ Plastic (Pvt) Ltd has been at the forefront of delivering 
                high-quality plastic solutions to industries and households across Sri Lanka. 
                Our commitment to excellence and innovation has made us a trusted name 
                in the plastic manufacturing industry.
              </p>
              
              <div className="stats">
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Products</p>
                </div>
                <div className="stat-item">
                  <h3>1000+</h3>
                  <p>Happy Clients</p>
                </div>
                <div className="stat-item">
                  <h3>5+</h3>
                  <p>Years Experience</p>
                </div>
              </div>
            </div>
            
            <div className="about-image">
              {/* Replace the placeholder with slideshow */}
              <FactorySlideshow />
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section section section-light">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            To provide innovative, sustainable, and high-quality plastic solutions that 
            meet the evolving needs of our customers while maintaining environmental responsibility.
          </p>
        </div>
      </section>

    
    </div>
  );
}

export default About;