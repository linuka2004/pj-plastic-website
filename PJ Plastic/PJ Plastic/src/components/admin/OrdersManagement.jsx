import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { request } from '../../api/client';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('date_desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expanded, setExpanded] = useState({}); // orderId => bool

  const statusOptions = [
    { id: 'confirmed', label: 'Confirmed', icon: '✅' },
    { id: 'processing', label: 'Processing', icon: '🔄' },
    { id: 'shipped', label: 'Shipped', icon: '🚚' },
    { id: 'delivered', label: 'Delivered', icon: '📦' },
  ];

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const list = await request('/orders');
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load orders', e);
      alert(e?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await request(`/orders/${id}`, { method: 'DELETE' });
      await loadOrders();
      alert('Order deleted');
    } catch (e) {
      alert(e?.message || 'Failed to delete order');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await request(`/orders/${id}`, { method: 'PUT', body: { status } });
      await loadOrders();
    } catch (e) {
      alert(e?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const goTrack = (id) => {
    window.open(`/order-tracking/${id}`, '_blank');
  };

  const fmtDate = (d) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };

  const statusBadgeStyle = (s) => {
    const map = {
      confirmed: { bg: '#e7f1ff', color: '#0d6efd', border: '#b6d4fe' },
      processing: { bg: '#fff3cd', color: '#997404', border: '#ffe69c' },
      shipped: { bg: '#cff4fc', color: '#055160', border: '#b6effb' },
      delivered: { bg: '#d1e7dd', color: '#0f5132', border: '#badbcc' },
    };
    const v = map[s] || { bg: '#f8f9fa', color: '#6c757d', border: '#e9ecef' };
    return {
      display: 'inline-block', padding: '2px 8px', borderRadius: 12,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`, fontSize: 12
    };
  };

  // Derived, user-friendly data operations
  const processed = useMemo(() => {
    let rows = Array.isArray(orders) ? orders.slice() : [];
    // Filter by query on id, senderName, senderMobile, address
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(o =>
        String(o.id).includes(q) ||
        (o.senderName || '').toLowerCase().includes(q) ||
        (o.senderMobile || '').toLowerCase().includes(q) ||
        (o.deliveryAddress || '').toLowerCase().includes(q)
      );
    }
    // Status filter
    if (statusFilter !== 'ALL') {
      rows = rows.filter(o => (o.status || '').toLowerCase() === statusFilter.toLowerCase());
    }
    // Sort
    rows.sort((a, b) => {
      const [key, dir] = sortKey.split('_');
      const mul = dir === 'asc' ? 1 : -1;
      if (key === 'date') {
        const da = new Date(a.orderDate || 0).getTime();
        const db = new Date(b.orderDate || 0).getTime();
        return (da - db) * mul;
      }
      if (key === 'total') {
        const ta = Number(a.total || 0);
        const tb = Number(b.total || 0);
        return (ta - tb) * mul;
      }
      // default id
      return (Number(a.id) - Number(b.id)) * mul;
    });
    return rows;
  }, [orders, query, statusFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, currentPage, pageSize]);

  const countsByStatus = useMemo(() => {
    const c = { confirmed: 0, processing: 0, shipped: 0, delivered: 0 };
    (orders || []).forEach(o => { const s = (o.status || '').toLowerCase(); if (c[s] !== undefined) c[s]++; });
    return c;
  }, [orders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div>
      <table style={{width:'100%', borderCollapse:'collapse', background:'#fff'}}>
        <caption style={{captionSide:'top', textAlign:'left', padding:'8px 0'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12, flexWrap:'wrap'}}>
            <h3 style={{margin: 0}}>Orders</h3>
            <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
              <span style={statusBadgeStyle('confirmed')}>Confirmed: {countsByStatus.confirmed}</span>
              <span style={statusBadgeStyle('processing')}>Processing: {countsByStatus.processing}</span>
              <span style={statusBadgeStyle('shipped')}>Shipped: {countsByStatus.shipped}</span>
              <span style={statusBadgeStyle('delivered')}>Delivered: {countsByStatus.delivered}</span>
              <span style={{opacity:0.8}}>Showing {pageRows.length} of {processed.length}</span>
              <button onClick={loadOrders} disabled={loading} style={{padding:'6px 12px'}}>{loading ? 'Loading...' : 'Refresh'}</button>
            </div>
          </div>
        </caption>
        <thead>
          <tr>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>ID</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>User ID</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Order Date</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Sender</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Mobile</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Address</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Delivery Date</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Items</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Total</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Payment</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Status</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Actions</th>
          </tr>
          <tr>
            <th colSpan="12" style={{textAlign:'left', padding:'8px 0', borderBottom:'1px solid #eee'}}>
              <div style={{display:'flex', gap: 8, alignItems:'center', flexWrap:'wrap'}}>
                <input
                  value={query}
                  onChange={e=>{ setQuery(e.target.value); setPage(1); }}
                  placeholder="Search by #ID, name, phone, address"
                  style={{padding:'6px 10px', border:'1px solid #ddd', borderRadius:6, minWidth:280}}
                />
                <select value={statusFilter} onChange={e=>{ setStatusFilter(e.target.value); setPage(1); }} style={{padding:'6px 10px', borderRadius:6}}>
                  <option value="ALL">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <select value={sortKey} onChange={e=> setSortKey(e.target.value)} style={{padding:'6px 10px', borderRadius:6}}>
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="total_desc">Total: high to low</option>
                  <option value="total_asc">Total: low to high</option>
                  <option value="id_desc">ID: high to low</option>
                  <option value="id_asc">ID: low to high</option>
                </select>
                <select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }} style={{padding:'6px 10px', borderRadius:6}}>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>{fmtDate(o.orderDate)}</td>
              <td>{o.senderName || '-'}</td>
              <td>{o.senderMobile || '-'}</td>
              <td style={{maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{o.deliveryAddress || '-'}</td>
              <td>{fmtDate(o.deliveryDate) || '-'}</td>
              <td>
                {(o.items||[]).length} item(s)
                <button
                  onClick={() => setExpanded(prev => ({...prev, [o.id]: !prev[o.id]}))}
                  style={{marginLeft:8, padding:'2px 8px', borderRadius:6}}
                >{expanded[o.id] ? 'Hide' : 'View'}</button>
                {expanded[o.id] && (
                  <div style={{marginTop:6, fontSize:12, color:'#333'}}>
                    {(o.items||[]).map((it, idx) => (
                      <div key={idx} style={{marginBottom:2}}>
                        Product #{it.productId} × {it.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td>{o.total != null ? `LKR ${Number(o.total).toFixed(2)}` : '-'}</td>
              <td>{o.paymentMethod || '-'}</td>
              <td>
                <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                  {statusOptions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => updateStatus(o.id, s.id)}
                      disabled={updatingId === o.id}
                      title={s.label}
                      style={{
                        padding:'6px 8px',
                        borderRadius:6,
                        border: o.status === s.id ? '2px solid #0d6efd' : '1px solid #ccc',
                        background: o.status === s.id ? '#e7f1ff' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{marginRight:6}}>{s.icon}</span>
                      <span style={{fontSize:12, opacity:0.9}}>{s.id}</span>
                    </button>
                  ))}
                </div>
              </td>
              <td>
                <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                  <button onClick={() => goTrack(o.id)}>View Tracking</button>
                  <button onClick={() => handleDelete(o.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {processed.length === 0 && (
            <tr><td colSpan="12" style={{padding:'1rem', textAlign:'center', color:'#666'}}>No orders found</td></tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="12" style={{paddingTop:12}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>Page {currentPage} of {totalPages}</div>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Next</button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
