import React from "react";
import './ContactCTA.css';

function ContactCTA() {
  return (
    <section className="contact-cta section section-dark">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today for quality plastic solutions tailored to your needs</p>
          <div className="cta-buttons">
            <a href="/contact" className="btn btn-primary">
              Get In Touch
            </a>
            <a href="tel:+94452264998" className="btn btn-secondary">
              <i className="fas fa-phone"></i>
              +94 45 226 4998
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;