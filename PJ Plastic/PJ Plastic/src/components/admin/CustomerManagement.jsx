import React, { useEffect, useState } from 'react';
import { request } from '../../api/client';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request('/users/customers');
      setCustomers(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await request(`/users/${id}`, { method: 'DELETE' });
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert(e.message || 'Failed to delete customer');
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Customers</h2>
        <button onClick={load}>Refresh</button>
      </div>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Full Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Mobile</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Address</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{c.id}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{c.fullName || '-'}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{c.email}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{c.mobile || '-'}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{c.address || '-'}</td>
                  <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                    <button onClick={() => handleDelete(c.id)} style={{ color: '#b00' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
