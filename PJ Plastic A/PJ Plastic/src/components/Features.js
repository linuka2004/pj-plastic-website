// components/Features.js
import React from "react";
import './Features.css';

function Features() {
  const features = [
    {
      icon: "📱",
      title: "Cross-Platform",
      description: "Build native mobile apps using React"
    },
    {
      icon: "⚡",
      title: "Fast Refresh",
      description: "See your changes as soon as you save"
    },
    {
      icon: "🔧",
      title: "Developer Experience",
      description: "Great tools and debugging support"
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2>Why React Native?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;