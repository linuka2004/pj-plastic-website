import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './ProductCategory.css';

function ProductCategory() {
  // Get category from URL or use default
  const categoryName = "Products"; // This would come from URL params
  
  return (
    <div className="product-category-page">
      <Header />
      
      <section className="category-hero">
        <div className="container">
          <h1>{categoryName} Category</h1>
          <p>Quality plastic solutions tailored to your needs</p>
        </div>
      </section>

      <section className="category-content">
        <div className="container">
          <div className="coming-soon-message">
            <div className="message-icon">🔄</div>
            <h2>Products Will Update Soon...</h2>
            <p>We're currently updating our product catalog with the latest items in this category.</p>
            <p>Please check back later to see our complete range of products.</p>
            <a href="/products" className="back-button">← Back to All Categories</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductCategory;