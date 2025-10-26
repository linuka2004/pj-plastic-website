import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { request, uploadProductImage } from '../api/client';
import {
  Sidebar,
  DashboardHeader,
  DatabaseInfoCards,
  MainStats,
  RevenueChart,
  AdditionalStats,
  RecentOrders,
  CategoryManagement,
  ProductManagement,
  OrdersManagement
} from '../components/admin';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeTimeFilter, setActiveTimeFilter] = useState('1W');
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({});
  const [databaseStats, setDatabaseStats] = useState({});
  const [orders, setOrders] = useState([]);
  
  // Categories state
  const [categories, setCategories] = useState([]);

  // Products state
  const [products, setProducts] = useState([]);

  // Load categories and products from backend
  const loadCategories = useCallback(async () => {
    try {
      const list = await request('/categories');
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const list = await request('/products');
      // Map backend product entity to UI shape used by ProductManagement
      const mapped = (Array.isArray(list) ? list : []).map(p => ({
        id: p.id,
        name: p.name,
        categoryId: p.category?.id || p.categoryId,
        description: p.description || '',
        price: p.price || 0,
        stock: p.qty ?? p.stock ?? 0,
        images: p.imageUrl ? [p.imageUrl] : [],
      }));
      setProducts(mapped);
    } catch (e) {
      console.error('Failed to load products', e);
    }
  }, []);

  // Load orders for revenue stats, chart, and recent orders
  const loadOrders = useCallback(async () => {
    try {
      const list = await request('/orders');
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  }, []);

  const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
  const formatDayKey = (d) => {
    const dt = new Date(d);
    return dt.toISOString().slice(0,10);
  };
  const labelDay = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  const formatMonthKey = (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
  };
  const labelMonth = (key) => {
    const [y,m] = key.split('-');
    const date = new Date(Number(y), Number(m)-1, 1);
    return date.toLocaleDateString(undefined, { month: 'short' });
  };

  const buildSalesData = useCallback((ordersList, filter) => {
    const now = new Date();
    if (filter === '1W') {
      // Last 7 days including today
      const days = [...Array(7)].map((_, idx) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - idx));
        const key = formatDayKey(d);
        const label = labelDay(d);
        const sales = sum(
          ordersList
            .filter(o => formatDayKey(o.orderDate || o.createdAt || now) === key)
            .map(o => o.total || 0)
        );
        return { day: label, sales };
      });
      return days;
    }
    if (filter === '1M') {
      // 4 weeks buckets, each 7 days back from now
      const buckets = [...Array(4)].map((_, i) => {
        const start = new Date(now);
        start.setDate(start.getDate() - (7 * (3 - i)));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const sales = sum(
          ordersList.filter(o => {
            const od = new Date(o.orderDate || o.createdAt || now);
            return od >= start && od <= end;
          }).map(o => o.total || 0)
        );
        return { day: `Week ${i+1}`, sales };
      });
      return buckets;
    }
    // 1Y: last 12 months
    const months = [];
    for (let i=11;i>=0;i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      const key = formatMonthKey(d);
      const label = labelMonth(key);
      const sales = sum(
        ordersList.filter(o => formatMonthKey(o.orderDate || o.createdAt || now) === key).map(o => o.total || 0)
      );
      months.push({ day: label, sales });
    }
    return months;
  }, []);

  const computeStatsFromOrders = useCallback((ordersList) => {
    const now = new Date();
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);
    const totals = ordersList.map(o => Number(o.total) || 0);
    const trailingYearSum = sum(ordersList.filter(o => new Date(o.orderDate || o.createdAt || now) >= lastYear).map(o => o.total || 0));
    const avgOrder = totals.length ? (sum(totals) / totals.length) : 0;
    // revenue growth: last 30 days vs previous 30 days
    const d30 = new Date(now); d30.setDate(now.getDate() - 30);
    const d60 = new Date(now); d60.setDate(now.getDate() - 60);
    const last30 = sum(ordersList.filter(o => {
      const od = new Date(o.orderDate || o.createdAt || now);
      return od >= d30 && od <= now;
    }).map(o => o.total || 0));
    const prev30 = sum(ordersList.filter(o => {
      const od = new Date(o.orderDate || o.createdAt || now);
      return od >= d60 && od < d30;
    }).map(o => o.total || 0));
    const revenueGrowth = prev30 > 0 ? (((last30 - prev30) / prev30) * 100) : 0;
    const totalOrders = ordersList.length;
    const activeCustomers = new Set(ordersList.map(o => o.userId || o.customerId)).size;
    return { trailingYear: trailingYearSum, avgOrder, revenueGrowth: Number(revenueGrowth.toFixed(1)), totalOrders, activeCustomers, conversionRate: 0 };
  }, []);

  const fetchDatabaseStats = useCallback(async () => {
    try {
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      const pendingOrders = orders.filter(o => (o.status || '').toLowerCase() !== 'delivered').length;
      const completedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
      const totalRevenue = sum(orders.map(o => o.total || 0));
      const activeUsers = new Set(orders.map(o => o.userId || o.customerId)).size;
      const mockDatabaseStats = {
        totalProducts: products.length,
        lowStockProducts,
        pendingOrders,
        completedOrders,
        databaseSize: '—',
        lastBackup: '—',
        serverStatus: 'Online',
        responseTime: '—',
        activeUsers,
        totalRevenue,
        systemUptime: '—'
      };
      setDatabaseStats(mockDatabaseStats);
    } catch (error) {
      console.error('Error fetching database stats:', error);
    }
  }, [products, orders]);

  const updateChartData = useCallback((timeFilter) => {
    const data = buildSalesData(orders, timeFilter);
    const computedStats = computeStatsFromOrders(orders);
    setSalesData(data);
    setStats(computedStats);
  }, [orders, buildSalesData, computeStatsFromOrders]);

  const handleTimeFilterClick = (filter) => {
    setActiveTimeFilter(filter);
    updateChartData(filter);
  };

  useEffect(() => {
    fetchDatabaseStats();
    updateChartData('1W');
    loadCategories();
    loadProducts();
    loadOrders();
  }, [fetchDatabaseStats, updateChartData, loadCategories, loadProducts, loadOrders]);

  // SIMPLE AND WORKING Category Management Functions
  const handleAddCategory = async (categoryData) => {
    try {
      await request('/categories', { method: 'POST', body: {
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon || undefined,
      }});
      // Ensure fresh list from backend
  await loadCategories();
  window.dispatchEvent(new Event('categories-updated'));
      alert('Category added successfully!');
      return true;
    } catch (e) {
      alert(e.message || 'Failed to add category');
      return false;
    }
  };

  const handleEditCategory = async (categoryId, categoryData) => {
    try {
      await request(`/categories/${categoryId}`, { method: 'PUT', body: {
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon || undefined,
      }});
      // Reload to keep counts and derived data consistent
  await loadCategories();
  window.dispatchEvent(new Event('categories-updated'));
      alert('Category updated successfully!');
      return true;
    } catch (e) {
      alert(e.message || 'Failed to update category');
      return false;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await request(`/categories/${categoryId}`, { method: 'DELETE' });
      // Refresh lists; backend may cascade or block
  await Promise.all([loadCategories(), loadProducts()]);
  window.dispatchEvent(new Event('categories-updated'));
      alert('Category deleted successfully!');
      return true;
    } catch (e) {
      if (e.status === 409 || /constraint|foreign key/i.test(e.message || '')) {
        alert('Cannot delete category because it has products. Please move or delete its products first.');
      } else if (e.status === 403) {
        alert('You are not authorized to delete categories.');
      } else {
        alert(e.message || 'Failed to delete category');
      }
      return false;
    }
  };

  // SIMPLE AND WORKING Product Management Functions
  const handleAddProduct = async (productData) => {
    try {
      const body = {
        name: productData.name,
        price: Number(productData.price),
        qty: Number(productData.stock),
        categoryId: Number(productData.categoryId),
      };
      const created = await request('/products', { method: 'POST', body });
      let uploadOk = true;
      if (created?.id && Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0) {
        try {
          await uploadProductImage(created.id, productData.imageFiles[0]);
        } catch (e) {
          uploadOk = false;
          console.warn('Image upload failed:', e);
          alert(`Image upload failed: ${e?.message || 'Unknown error'}`);
        }
      }
      // Reload to ensure consistency with backend
      await loadProducts();
      if (uploadOk) {
        alert('Product and image saved successfully!');
      } else {
        alert('Product saved, but image upload failed. Please try uploading the image again.');
      }
      return true;
    } catch (e) {
      alert(e.message || 'Failed to add product');
      return false;
    }
  };

  const handleEditProduct = async (productId, productData) => {
    try {
      const body = {
        name: productData.name,
        price: Number(productData.price),
        qty: Number(productData.stock),
        categoryId: Number(productData.categoryId),
      };
      await request(`/products/${productId}`, { method: 'PUT', body });
      let uploadOk = true;
      if (Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0) {
        try {
          await uploadProductImage(productId, productData.imageFiles[0]);
        } catch (e) {
          uploadOk = false;
          console.warn('Image upload failed:', e);
          alert(`Image upload failed: ${e?.message || 'Unknown error'}`);
        }
      }
      await loadProducts();
      if (uploadOk) {
        alert('Product updated successfully!');
      } else {
        alert('Product updated, but image upload failed.');
      }
      return true;
    } catch (e) {
      alert(e.message || 'Failed to update product');
      return false;
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await request(`/products/${productId}`, { method: 'DELETE' });
      await loadProducts();
      alert('Product deleted successfully!');
      return true;
    } catch (e) {
      if (e.status === 403) {
        alert('You are not authorized to delete products.');
      } else {
        alert(e.message || 'Failed to delete product');
      }
      return false;
    }
  };

  const recentOrders = useMemo(() => {
    const byDateDesc = [...orders].sort((a,b) => {
      const da = new Date(a.orderDate || a.createdAt || 0).getTime();
      const db = new Date(b.orderDate || b.createdAt || 0).getTime();
      return db - da;
    });
    return byDateDesc.slice(0,5).map(o => ({
      id: `#${o.id}`,
      customer: o.senderName || `User ${o.userId || o.customerId || ''}`,
      amount: Number(o.total || 0),
      status: (o.status || 'Pending'),
      date: new Date(o.orderDate || o.createdAt || Date.now()).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })
    }));
  }, [orders]);

  const timeFilters = ['1W', '1M', '1Y'];

  const renderOverview = () => (
    <div className="overview">
      <DashboardHeader />
      <DatabaseInfoCards databaseStats={databaseStats} />
      <MainStats stats={stats} />
      <RevenueChart 
        salesData={salesData}
        activeTimeFilter={activeTimeFilter}
        timeFilters={timeFilters}
        onTimeFilterChange={handleTimeFilterClick}
      />
      <div className="bottom-section">
        <AdditionalStats stats={stats} databaseStats={databaseStats} />
        <RecentOrders recentOrders={recentOrders} />
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="management-page">
      <CategoryManagement
        categories={categories.map(c => ({
          ...c,
          productCount: products.filter(p => p.categoryId === c.id).length,
          createdAt: c.createdAt || '',
        }))}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );

  const renderProducts = () => (
    <div className="management-page">
      <ProductManagement
        products={products}
        categories={categories}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );

  const renderOrders = () => (
    <div className="orders-management">
      <OrdersManagement />
    </div>
  );

  const renderUsers = () => (
    <div className="users-management">
      <h2>Customer Management</h2>
      {/* List and delete customers */}
      <div style={{ marginTop: '1rem' }}>
        {/* Lazy import keeping current admin index API */}
        {(() => {
          const { CustomerManagement } = require('../components/admin');
          const C = CustomerManagement?.default || CustomerManagement;
          return C ? <C /> : null;
        })()}
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          <div className="top-actions">
            <button
              className="btn-secondary go-home-btn"
              onClick={() => window.open('http://localhost:3000/', '_self')}
              title="Go to Home Page"
            >
              ⤶ Go to Home
            </button>
          </div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'users' && renderUsers()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;