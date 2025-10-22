// import React, { useState } from 'react';

// const ProductManagement = ({ products, categories, onAddProduct, onEditProduct, onDeleteProduct }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     categoryId: '',
//     description: '',
//     price: '',
//     stock: '',
//     images: []
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleOpenModal = (product = null) => {
//     if (product) {
//       setEditingProduct(product);
//       setFormData({
//         name: product.name,
//         categoryId: product.categoryId.toString(),
//         description: product.description,
//         price: product.price.toString(),
//         stock: product.stock.toString(),
//         images: product.images || []
//       });
//     } else {
//       setEditingProduct(null);
//       setFormData({
//         name: '',
//         categoryId: '',
//         description: '',
//         price: '',
//         stock: '',
//         images: []
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingProduct(null);
//     setFormData({
//       name: '',
//       categoryId: '',
//       description: '',
//       price: '',
//       stock: '',
//       images: []
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) {
//       alert('Please enter a product name');
//       return;
//     }
//     if (!formData.categoryId) {
//       alert('Please select a category');
//       return;
//     }
//     if (!formData.price || Number(formData.price) <= 0) {
//       alert('Please enter a valid price');
//       return;
//     }
//     if (!formData.stock || Number(formData.stock) < 0) {
//       alert('Please enter a valid stock quantity');
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const ok = editingProduct
//         ? await onEditProduct(editingProduct.id, formData)
//         : await onAddProduct(formData);
//       if (ok !== false) {
//         handleCloseModal();
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const newImage = reader.result;
//         setFormData(prev => ({
//           ...prev,
//           images: [newImage, ...prev.images.slice(0, 4)]
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const getCategoryName = (categoryId) => {
//     const category = categories.find(cat => cat.id === categoryId);
//     return category ? category.name : 'Uncategorized';
//   };

//   const formatPrice = (price) => {
//     return `LKR ${Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
//   };

//   return (
//     <div className="management-section">
//       <div className="section-header">
//         <h2>Product Management</h2>
//         <button 
//           className="btn-primary"
//           onClick={() => handleOpenModal()}
//         >
//           + Add New Product
//         </button>
//       </div>

//       <div className="products-grid">
//         {products.map(product => (
//           <div key={product.id} className="product-card">
//             <div className="product-image">
//               {product.images && product.images.length > 0 ? (
//                 <img src={product.images[0]} alt={product.name} />
//               ) : (
//                 <div className="no-image">📦 No Image</div>
//               )}
//             </div>
//             <div className="product-info">
//               <h3>{product.name}</h3>
//               <p className="product-category">
//                 {getCategoryName(product.categoryId)}
//               </p>
//               <p className="product-description">{product.description}</p>
//               <div className="product-details">
//                 <span className="product-price">{formatPrice(product.price)}</span>
//                 <span className={`product-stock ${product.stock < 10 ? 'low-stock' : ''}`}>
//                   Stock: {product.stock}
//                 </span>
//               </div>
//             </div>
//             <div className="product-actions">
//               <button 
//                 className="btn-edit"
//                 onClick={() => handleOpenModal(product)}
//               >
//                 Edit
//               </button>
//               <button 
//                 className="btn-delete"
//                 onClick={() => onDeleteProduct(product.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal large-modal">
//             <div className="modal-header">
//               <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
//               <button className="close-btn" onClick={handleCloseModal}>×</button>
//             </div>
//             <form onSubmit={handleSubmit} className="modal-form">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="productName">Product Name *</label>
//                   <input
//                     type="text"
//                     id="productName"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter product name"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="productCategory">Category *</label>
//                   <select
//                     id="productCategory"
//                     name="categoryId"
//                     value={formData.categoryId}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="productPrice">Price (LKR) *</label>
//                   <input
//                     type="number"
//                     id="productPrice"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                     min="0"
//                     step="0.01"
//                     placeholder="0.00"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="productStock">Stock *</label>
//                   <input
//                     type="number"
//                     id="productStock"
//                     name="stock"
//                     value={formData.stock}
//                     onChange={handleChange}
//                     required
//                     min="0"
//                     placeholder="0"
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="productDescription">Description</label>
//                 <textarea
//                   id="productDescription"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows="4"
//                   placeholder="Enter product description"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="productImages">Product Images</label>
//                 <input
//                   type="file"
//                   id="productImages"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//                 <div className="image-previews">
//                   {formData.images.map((image, index) => (
//                     <div key={index} className="image-preview">
//                       <img src={image} alt={`Preview ${index + 1}`} />
//                       <button 
//                         type="button" 
//                         className="remove-image"
//                         onClick={() => removeImage(index)}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="form-actions">
//                 <button type="button" onClick={handleCloseModal} className="btn-secondary" disabled={submitting}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn-primary" disabled={submitting}>
//                   {editingProduct ? 'Update Product' : 'Add Product'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductManagement;

import React, { useState } from 'react';

const ProductManagement = ({ products, categories, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    stock: '',
    images: [],
    imageFiles: [] // actual File objects for upload
  });
  const [submitting, setSubmitting] = useState(false);

  // Open modal for new or existing product
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        categoryId: product.categoryId?.toString() || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        images: Array.isArray(product.images) ? product.images : [],
        imageFiles: []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        categoryId: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        imageFiles: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      price: '',
      stock: '',
      images: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert('Please enter a product name');
    if (!formData.categoryId) return alert('Please select a category');
    if (!formData.price || Number(formData.price) <= 0) return alert('Please enter a valid price');
    if (!formData.stock || Number(formData.stock) < 0) return alert('Please enter a valid stock quantity');

    setSubmitting(true);

    const dataToSend = {
      ...formData,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      const ok = editingProduct
        ? await onEditProduct(editingProduct.id, dataToSend)
        : await onAddProduct(dataToSend);

      if (ok !== false) handleCloseModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setFormData(prev => ({
          ...prev,
          images: [newImage, ...prev.images].slice(0, 5), // preview
          imageFiles: [file, ...prev.imageFiles].slice(0, 5), // store File(s)
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === Number(categoryId));
    return category ? category.name : 'Uncategorized';
  };

  const formatPrice = (price) => `LKR ${Number(price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Add New Product</button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="no-image">📦 No Image</div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{getCategoryName(product.categoryId)}</p>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="product-price">{formatPrice(product.price)}</span>
                <span className={`product-stock ${product.stock < 10 ? 'low-stock' : ''}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn-edit" onClick={() => handleOpenModal(product)}>Edit</button>
              <button className="btn-delete" onClick={() => {
                if (window.confirm("Are you sure you want to delete this product?")) {
                  onDeleteProduct(product.id);
                }
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (LKR) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Enter product description" />
              </div>

              <div className="form-group">
                <label>Product Images</label>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                <div className="image-previews">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="image-preview">
                      <img src={img} alt={`Preview ${idx + 1}`} />
                      <button type="button" className="remove-image" onClick={() => removeImage(idx)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-secondary" disabled={submitting}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
