import React, { useState, useEffect } from "react";
import logo from '../assets/images/logo.png';
import './Hero.css';

// Import your slideshow images
import slide1 from '../assets/factory/factory1.jpg';
import slide2 from '../assets/factory/factory2.jpg';
import slide3 from '../assets/factory/factory3.jpg';
import slide4 from '../assets/factory/factory4.jpg';

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      url: slide1,
      title: "Modern Manufacturing",
      description: "State-of-the-art plastic manufacturing facility"
    },
    {
      id: 2,
      url: slide2,
      title: "Quality Production",
      description: "Precision engineering for superior quality products"
    },
    {
      id: 3,
      url: slide3,
      title: "Innovation Center", 
      description: "Continuous innovation in plastic solutions"
    },
    {
      id: 4,
      url: slide4,
      title: "Eco-Friendly Solutions",
      description: "Sustainable manufacturing practices"
    }
  ];

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="rn-hero">
      {/* Logo and Text Section at Top */}
      <div className="hero-top-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-logo">
              <img src={logo} alt="PJ Plastic Logo" className="logo-image" />
            </div>
            <p className="hero-subtitle">
              Quality Plastic Solutions for Modern Living
            </p>
            <div className="hero-buttons">
              <a href="/products" className="btn btn-primary">
                Our Products
              </a>
              <a href="/contact" className="btn btn-secondary">
                <i className="fas fa-phone"></i>
                &nbsp;Hotline
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow Section Below */}
      <div className="hero-slideshow-section">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-image">
                <img src={slide.url} alt={slide.title} />
                <div className="slide-overlay">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button className="slideshow-btn prev" onClick={prevSlide} aria-label="Previous slide">
          {/* Arrow created with CSS */}
        </button>
        <button className="slideshow-btn next" onClick={nextSlide} aria-label="Next slide">
          {/* Arrow created with CSS */}
        </button>

        {/* Dot indicators */}
        <div className="slideshow-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>
    </section>
  );
}

export default Hero;