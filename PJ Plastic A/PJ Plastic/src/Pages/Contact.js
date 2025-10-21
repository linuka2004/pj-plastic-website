import React from "react";
//import Header from "../components/Header";
//import Footer from "../components/Footer";
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      
      
      <section className="contact-hero section section-light">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">Get in touch with PJ Plastic for quality plastic solutions</p>
        </div>
      </section>

      <section className="contact-cta section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Contact us today for quality plastic solutions tailored to your needs</p>
            <div className="cta-buttons">
              <a href="#contact-form" className="btn btn-primary">
                Get In Touch
              </a>
              <a href="tel:+94452264998" className="btn btn-secondary">
                <i className="fas fa-phone"></i>
                &nbsp;Hotline
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="map-section section section-light">
        <div className="container">
          <h2 className="map-title">Find Us</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.047150966098!2d80.36729037475551!3d6.76410569323261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bd00348ec20f%3A0xd6503bc20d3b212a!2sPJ%20Plastic%20(pvt)Ltd.!5e0!3m2!1sen!2slk!4v1759392588750!5m2!1sen!2slk"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PJ Plastic Location in Ratnapura, Sri Lanka"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="contact-info section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form id="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Your Phone" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
            
            <div className="contact-details">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Address</h4>
                  <p>Ratnapura, Sri Lanka</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Hotline</h4>
                  <p>+94 45 226 4998</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>info@pjplastic.com</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 8:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default Contact;