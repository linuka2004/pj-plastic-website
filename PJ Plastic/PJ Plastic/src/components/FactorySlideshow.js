import React, { useState, useEffect } from 'react';
import './FactorySlideshow.css';

// Import your actual images
import factory1 from '../assets/factory/factory1.jpg';
import factory2 from '../assets/factory/factory2.jpg';
import factory3 from '../assets/factory/factory3.jpg';
import factory4 from '../assets/factory/factory4.jpg';

function FactorySlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use only your 4 actual images
  const factoryImages = [
    {
      id: 1,
      url: factory1,
      title: "Our Manufacturing Facility",
      description: "State-of-the-art plastic manufacturing equipment"
    },
    {
      id: 2,
      url: factory2,
      title: "Quality Control Process",
      description: "Rigorous quality checks ensuring product excellence"
    },
    {
      id: 3,
      url: factory3, 
      title: "Production Line",
      description: "Efficient production processes for timely delivery"
    },
    {
      id: 4,
      url: factory4,
      title: "Warehouse & Storage",
      description: "Spacious storage facilities for bulk orders"
    }
  ];

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % factoryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [factoryImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % factoryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + factoryImages.length) % factoryImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="factory-slideshow">
      <div className="slideshow-container">
        {factoryImages.map((image, index) => (
          <div
            key={image.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-image">
              <img src={image.url} alt={image.title} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="slideshow-btn prev" onClick={prevSlide} aria-label="Previous slide">
        {/* Arrow is now created with CSS */}
      </button>
      <button className="slideshow-btn next" onClick={nextSlide} aria-label="Next slide">
        {/* Arrow is now created with CSS */}
      </button>

      {/* Dot indicators */}
      <div className="slideshow-dots">
        {factoryImages.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter removed */}
    </div>
  );
}

export default FactorySlideshow;