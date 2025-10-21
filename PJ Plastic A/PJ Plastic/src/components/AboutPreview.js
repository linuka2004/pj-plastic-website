import React from "react";
import './AboutPreview.css';

function AboutPreview() {
  return (
    <section className="about-preview section section-light">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About PJ Plastic</h2>
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
            <a href="/about" className="btn btn-primary">Learn More</a>
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              🏭 Factory Image
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPreview;