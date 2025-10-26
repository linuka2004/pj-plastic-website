import React, { useState } from "react";
//import Header from "../components/Header";
import Hero from "../components/Hero";
//import Footer from "../components/Footer";
import './Home.css';

function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "Modern Manufacturing",
      description: "State-of-the-art equipment with advanced production techniques for superior quality products",
      icon: "🏭"
    },
    {
      title: "Eco-Friendly",
      description: "Sustainable manufacturing practices with environmentally conscious solutions",
      icon: "🌱"
    },
    {
      title: "Quality Guaranteed",
      description: "Rigorous quality control processes ensuring every product meets the highest standards",
      icon: "✅"
    },
    {
      title: "Fast Delivery",
      description: "Efficient logistics network for timely delivery across all regions of Sri Lanka",
      icon: "🚚"
    }
  ];

  return (
    <div className="home-page">
    
      <Hero />
      
      {/* Features Tabs Section */}
      <section className="features-tabs-section">
        <div className="container">
          <div className="features-header">
            <h2>Why Choose PJ Plastic?</h2>
            <p>Excellence in plastic manufacturing since 2019</p>
          </div>
          
          <div className="tabs-container">
            <div className="tabs-navigation">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  <span className="tab-icon">{feature.icon}</span>
                  <span className="tab-title">{feature.title}</span>
                </button>
              ))}
            </div>
            
            <div className="tab-content">
              <div className="tab-panel active">
                <h3>{features[activeTab].title}</h3>
                <p>{features[activeTab].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-count="50">50+</div>
              <div className="stat-label">+ Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="1000">100+</div>
              <div className="stat-label">+ Happy Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="5">5</div>
              <div className="stat-label">+ Years Experience</div>
            </div>
            {/* <div className="stat-item">
              <div className="stat-number" data-count="24">0</div>
              <div className="stat-label">24/7 Support</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Contact us today for quality plastic solutions tailored to your needs</p>
            <div className="cta-buttons">
              <a href="/products" className="cta-btn primary">View Products</a>
              <a href="/contact" className="cta-btn secondary">Get Quote</a>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default Home;