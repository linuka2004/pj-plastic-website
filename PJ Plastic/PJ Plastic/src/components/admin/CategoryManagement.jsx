import React, { useState } from 'react';

const CategoryManagement = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    setSubmitting(true);
    try {
      const ok = editingCategory
        ? await onEditCategory(editingCategory.id, formData)
        : await onAddCategory(formData);
      if (ok !== false) {
        handleCloseModal();
      }
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

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Category Management</h2>
        <button 
          className="btn-primary"
          onClick={() => handleOpenModal()}
        >
          + Add New Category
        </button>
      </div>

      <div className="content-grid">
        {categories.map(category => (
          <div key={category.id} className="content-card">
            <div className="card-header">
          <h3>{category.icon ? <span style={{marginRight: 8}}>{category.icon}</span> : null}{category.name}</h3>
              <div className="card-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleOpenModal(category)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => onDeleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="card-content">
              <p><strong>Description:</strong> {category.description}</p>
              <p><strong>Products:</strong> {category.productCount || 0}</p>
              <p><strong>Created:</strong> {category.createdAt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="categoryName">Category Name *</label>
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryIcon">Icon (optional)</label>
                <input
                  type="text"
                  id="categoryIcon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g., 🏠 or 📦 (emoji)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryDescription">Description</label>
                <textarea
                  id="categoryDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter category description"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-secondary" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;