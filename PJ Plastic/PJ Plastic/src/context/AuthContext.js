import React, { createContext, useContext, useState, useEffect } from 'react';
import { request, setToken as saveToken, clearToken, getToken, decodeJwt } from '../api/client';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Initialize from stored token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = decodeJwt(token);
      const username = payload?.sub || payload?.username;
      // Try to fetch full user profile to get role/isAdmin
      request(`/users/username/${encodeURIComponent(username)}`)
        .then(profile => {
          setCurrentUser({
            username,
            email: profile?.email,
            role: profile?.role,
            isAdmin: !!profile?.isAdmin,
            id: profile?.id,
            token,
          });
          setUserData({
            fullName: profile?.fullName,
            phone: profile?.mobile,
            address: profile?.address,
            createdAt: profile?.createdAt || Date.now(),
          });
        })
        .catch(() => {
          setCurrentUser({ username, token });
          setUserData(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Register user with backend
  const register = async ({ fullName, email, mobile, address, password }) => {
    // Backend expects: username, email, password, mobile, address, fullName, optional isAdmin/role
    const username = email; // Use email as username in this UI
    const body = { username, email, password, mobile, address, fullName };
    return request('/auth/register', { method: 'POST', body });
  };

  // Login user, store JWT and decode username
  const login = async ({ email, password }) => {
    const username = email; // matching backend expectation
    const token = await request('/auth/login', { method: 'POST', body: { username, password } });
    // The login endpoint returns plain string token
    const jwt = typeof token === 'string' ? token : token?.token || '';
    if (!jwt) throw new Error('Invalid token received');
    saveToken(jwt);
    const payload = decodeJwt(jwt);
    const uname = payload?.sub || username;
    // Fetch profile for role/isAdmin
    try {
      const profile = await request(`/users/username/${encodeURIComponent(uname)}`);
      const user = {
        username: uname,
        email: profile?.email || email,
        role: profile?.role,
        isAdmin: !!profile?.isAdmin,
        id: profile?.id,
        token: jwt,
      };
      setCurrentUser(user);
      setUserData({
        fullName: profile?.fullName,
        phone: profile?.mobile,
        address: profile?.address,
        createdAt: profile?.createdAt || Date.now(),
      });
      return { username: user.username, role: user.role, isAdmin: user.isAdmin };
    } catch (_e) {
      const user = { username: uname, token: jwt, email };
      setCurrentUser(user);
      setUserData(null);
      return { username: user.username, role: undefined, isAdmin: false };
    }
  };

  // Logout clears token and user
  const logout = () => {
    clearToken();
    setCurrentUser(null);
    setUserData(null);
    return Promise.resolve();
  };

  // Fetch orders for the current user from backend
  const getUserOrders = async () => {
    try {
      if (!currentUser?.id) return [];
      const orders = await request(`/orders/user/${currentUser.id}`);
      return Array.isArray(orders) ? orders : [];
    } catch (e) {
      console.error('Failed to load user orders', e);
      return [];
    }
  };

  // Update current user's profile
  const updateProfile = async (updates) => {
    if (!currentUser?.id) throw new Error('Not authenticated');
    // Map to backend UpdateUserDto fields (pascal-case keys)
    const body = {};
    if (typeof updates.fullName === 'string') body.FullName = updates.fullName;
    if (typeof updates.email === 'string') body.Email = updates.email;
    if (typeof updates.phone === 'string') body.Mobile = updates.phone;
    if (typeof updates.address === 'string') body.Address = updates.address;
    if (typeof updates.password === 'string' && updates.password.trim()) body.Password = updates.password;
    const updated = await request(`/users/${currentUser.id}`, { method: 'PUT', body });
    // Update local auth state
    if (updated) {
      setUserData(prev => ({
        ...prev,
        fullName: updated.fullName ?? updates.fullName ?? prev?.fullName,
        phone: updated.mobile ?? updates.phone ?? prev?.phone,
        address: updated.address ?? updates.address ?? prev?.address,
        createdAt: prev?.createdAt ?? Date.now(),
      }));
      setCurrentUser(prev => ({
        ...prev,
        email: updated.email ?? updates.email ?? prev?.email,
      }));
    }
    return updated;
  };

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
    getUserOrders,
    updateProfile,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}