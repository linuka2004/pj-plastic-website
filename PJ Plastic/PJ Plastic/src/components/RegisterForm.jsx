import React, { useState } from 'react';
import { request } from '../api/client';

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        username: form.email,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        address: form.address,
        fullName: form.fullName,
        // Either pass role or isAdmin; backend prioritizes role
        role: form.role,
        isAdmin: form.role === 'ADMIN',
      };
      await request('/auth/register', { method: 'POST', body });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Full Name</label>
        <input name="fullName" value={form.fullName} onChange={onChange} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
      </div>
      <div>
        <label>Mobile</label>
        <input name="mobile" value={form.mobile} onChange={onChange} />
      </div>
      <div>
        <label>Address</label>
        <input name="address" value={form.address} onChange={onChange} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
}
