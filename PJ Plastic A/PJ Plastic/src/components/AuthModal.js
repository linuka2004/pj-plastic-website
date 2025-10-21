import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

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
  
  const { login, signup, signInWithGoogle, signInWithFacebook } = useAuth();

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
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password);
        // Here you can save additional user data to Firestore
      }
      onClose();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'facebook') {
        await signInWithFacebook();
      }
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

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
              type="email"
              name="email"
              placeholder="Email Address"
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

        <div className="social-auth">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={() => handleSocialLogin('google')}
            >
              <i className="fab fa-google"></i>
              Google
            </button>
            <button 
              type="button" 
              className="social-btn facebook-btn"
              onClick={() => handleSocialLogin('facebook')}
            >
              <i className="fab fa-facebook"></i>
              Facebook
            </button>
          </div>
        </div>

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