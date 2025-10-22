import React from "react";
import './ProductsPreview.css';

function ProductsPreview() {
  const products = [
    { icon: "🏠", title: "Household Products", description: "Quality plastic items for everyday use" },
    { icon: "🏭", title: "Industrial Solutions", description: "Durable plastic components for industries" },
    { icon: "🚰", title: "Water Tanks", description: "Reliable water storage solutions" },
    { icon: "📦", title: "Packaging", description: "Custom packaging solutions" }
  ];

  return (
    <section className="products-preview section">
      <div className="container">
        <div className="section-header">
          <h2>Our Products</h2>
          <p>Explore our wide range of quality plastic solutions</p>
        </div>
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-icon">{product.icon}</div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="/products" className="btn btn-primary">View All Products</a>
        </div>
      </div>
    </section>
  );
}

export default ProductsPreview;