import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';
import { useNavigate } from 'react-router-dom';

function AuthModal({ isOpen, onClose, mode = 'login' }) {
  const [activeMode, setActiveMode] = useState(mode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeMode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match');
      }
      if (formData.password.length < 6) {
        return setError('Password should be at least 6 characters');
      }
    }

    setLoading(true);

    try {
      if (activeMode === 'login') {
        const info = await login({ email: formData.email, password: formData.password });
        if (info?.isAdmin || (info?.role && String(info.role).toUpperCase() === 'ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/my-account');
        }
      } else {
        await register({
          fullName: formData.name,
          email: formData.email,
          mobile: formData.phone,
          address: '',
          password: formData.password,
        });
        // Auto login after successful registration
        const info = await login({ email: formData.email, password: formData.password });
        if (info?.isAdmin || (info?.role && String(info.role).toUpperCase() === 'ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/my-account');
        }
      }
      onClose();
    } catch (error) {
      setError(error.message || 'Authentication failed');
    }
    setLoading(false);
  };

  // Social login is not wired to backend; hide for now or keep disabled

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h2>{activeMode === 'login' ? 'Login' : 'Create Account'}</h2>
          <div className="auth-tabs">
            <button 
              className={activeMode === 'login' ? 'active' : ''}
              onClick={() => setActiveMode('login')}
            >
              Login
            </button>
            <button 
              className={activeMode === 'signup' ? 'active' : ''}
              onClick={() => setActiveMode('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {activeMode === 'signup' && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Contact Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Email or Username"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {activeMode === 'signup' && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Loading...' : (activeMode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {/* Social auth temporarily disabled until backend support */}

        <div className="auth-footer">
          {activeMode === 'login' ? (
            <p>Don't have an account? <span onClick={() => setActiveMode('signup')}>Sign up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setActiveMode('login')}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;