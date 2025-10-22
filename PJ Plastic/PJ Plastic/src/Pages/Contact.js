import React, { useState } from "react";
import { GOOGLE_FORM_ACTION, GOOGLE_FORM_FIELDS } from "../config/feedback";
//import Header from "../components/Header";
//import Footer from "../components/Footer";
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    if (!GOOGLE_FORM_ACTION.includes("formResponse") || GOOGLE_FORM_ACTION.includes("REPLACE_FORM_ID")) {
      setError("Feedback is not configured yet. Please set your Google Form in src/config/feedback.js");
      return;
    }
    if (!GOOGLE_FORM_FIELDS.name.includes("entry.") || !GOOGLE_FORM_FIELDS.message.includes("entry.")) {
      setError("Google Form field IDs are missing. Update src/config/feedback.js");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append(GOOGLE_FORM_FIELDS.name, form.name);
      fd.append(GOOGLE_FORM_FIELDS.email, form.email);
      if (GOOGLE_FORM_FIELDS.phone && form.phone) fd.append(GOOGLE_FORM_FIELDS.phone, form.phone);
      fd.append(GOOGLE_FORM_FIELDS.message, form.message);
      // Google Forms expects a POST with form-encoded data, but FormData works too.
      // Use no-cors: the response will be opaque; assume success if no network error.
      await fetch(GOOGLE_FORM_ACTION, { method: "POST", mode: "no-cors", body: fd });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };
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
              <form id="contact-form" onSubmit={onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone (optional)"
                    value={form.phone}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={form.message}
                    onChange={onChange}
                    required
                  ></textarea>
                </div>
                {error && <p style={{ color: "#d33", marginBottom: "8px" }}>{error}</p>}
                {submitted && !error && (
                  <p style={{ color: "#0a7", marginBottom: "8px" }}>
                    Thanks! Your message was sent.
                  </p>
                )}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Sending…" : "Send Message"}
                </button>
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
                  <p>Admin@pjplastic.com</p>
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