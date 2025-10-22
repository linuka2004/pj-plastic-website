import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { request } from "../api/client";
import './Products.css';

function Products() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesBE, setCategoriesBE] = useState([]);
  const [productsBE, setProductsBE] = useState([]);
  const individualProductsRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        request('/categories').catch(() => []),
        request('/products').catch(() => []),
      ]);
      setCategoriesBE(Array.isArray(cats) ? cats : []);
      setProductsBE(Array.isArray(prods) ? prods : []);
    } catch (_) {
      // ignore network errors
    }
  }, []);

  // Load categories and products from backend
  useEffect(() => {
    let mounted = true;
    fetchData();
    const onCategoriesUpdated = () => {
      if (mounted) fetchData();
    };
    window.addEventListener('categories-updated', onCategoriesUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('categories-updated', onCategoriesUpdated);
    };
  }, [fetchData]);

  // Build UI-friendly categories from backend data (fallback to static if none)
  const productCategories = useMemo(() => {
    if (categoriesBE && categoriesBE.length > 0) {
      return categoriesBE.map((c, idx) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        icon: c.icon || ['🏠','🏭','📦','🧰','🛒'][idx % 5],
        slug: String(c.name || `cat-${c.id}`).toLowerCase().replace(/\s+/g, '-'),
        features: [],
        price: 0,
        image: "/images/placeholder-product.jpg",
      }));
    }
    return [
      {
        id: 1,
        name: "Household Products",
        description: "Quality plastic items for everyday use",
        icon: "🏠",
        slug: "household",
        features: ["Kitware items", "Storage containers", "Utensils", "Home organization"],
        price: 4500,
        image: "/images/household-products.jpg"
      },
      {
        id: 2,
        name: "Industrial Solutions", 
        description: "Durable plastic components for industries",
        icon: "🏭",
        slug: "industrial",
        features: ["Machine parts", "Industrial containers", "Pipes and fittings", "Custom components"],
        price: 22500,
        image: "/images/industrial-solutions.jpg"
      },
      {
        id: 3,
        name: "Packaging Solutions",
        description: "Custom packaging solutions",
        icon: "📦",
        slug: "packaging",
        features: ["Food packaging", "Industrial packaging", "Custom sizes", "Bulk orders"],
        price: 7500,
        image: "/images/packaging-solutions.jpg"
      }
    ];
  }, [categoriesBE]);

  // Build per-category product lists from backend
  const individualProducts = useMemo(() => {
    if (productsBE && productsBE.length > 0 && categoriesBE && categoriesBE.length > 0) {
      const bySlug = {};
      const slugByCatId = new Map(
        productCategories.map(c => [c.id, c.slug])
      );
      productsBE.forEach(p => {
        const catId = p.category?.id || p.categoryId;
        const slug = slugByCatId.get(catId);
        if (!slug) return;
        if (!bySlug[slug]) bySlug[slug] = [];
        bySlug[slug].push({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: p.price || 0,
          image: (p.imageUrl && String(p.imageUrl).trim()) ? p.imageUrl : "/images/placeholder-product.jpg",
          features: [],
        });
      });
      return bySlug;
    }
    return {};
  }, [productsBE, categoriesBE, productCategories]);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleViewProducts = (categorySlug) => {
    setSelectedCategory(categorySlug);
    // Use setTimeout to ensure the component has re-rendered before scrolling
    setTimeout(() => {
      if (individualProductsRef.current) {
        individualProductsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    // Scroll back to top when going back to categories
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-LK')}`;
  };

  return (
    <div className="products-page">
      <section className="products-hero section section-light">
        <div className="container">
          <h1>Our Products</h1>
          <p className="hero-subtitle">Quality plastic solutions for every need</p>
        </div>
      </section>

      {!selectedCategory ? (
        <section className="products-grid-section section">
          <div className="container">
            <h2 className="section-title">Product Categories</h2>
            <div className="products-grid">
              {productCategories.map(category => (
                <div key={category.id} className="product-card">
                  <div className="product-header">
                    <div className="product-icon">{category.icon}</div>
                    <h3>{category.name}</h3>
                  </div>
                  <p className="product-description">{category.description}</p>
                  
                  <div className="features-list">
                    {category.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="checkmark">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="product-button-container">
                    <div className="button-group">
                      <button 
                        onClick={() => handleViewProducts(category.slug)}
                        className="btn btn-secondary"
                      >
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section 
          className="individual-products-section section" 
          ref={individualProductsRef}
        >
          <div className="container">
            <div className="section-header">
              <button 
                onClick={handleBackToCategories}
                className="back-button"
              >
                ← Back to Categories
              </button>
              <h2 className="section-title">
                {productCategories.find(cat => cat.slug === selectedCategory)?.name}
              </h2>
              <p className="section-subtitle">
                {productCategories.find(cat => cat.slug === selectedCategory)?.description}
              </p>
            </div>

            <div className="individual-products-grid">
              {individualProducts[selectedCategory]?.map(product => {
                const isPlaceholder = !product.image || product.image.includes('placeholder-product.jpg');
                return (
                <div key={product.id} className="individual-product-card">
                  <div className={`product-image ${isPlaceholder ? 'placeholder' : ''}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg';
                        e.target.style.objectFit = 'contain';
                        e.target.style.padding = '20px';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-features">
                      {product.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    
                    <div className="product-footer">
                      <div className="product-price-individual">
                        {formatPrice(product.price)}
                      </div>
                      {isAuthenticated && (
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-primary add-to-cart-btn"
                        >
                          <i className="fas fa-cart-plus"></i>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Products;