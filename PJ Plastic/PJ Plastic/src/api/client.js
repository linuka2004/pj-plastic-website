// Simple API client for the PJ Plastic frontend to talk to the Spring Boot backend
// Uses fetch and attaches JWT from localStorage when available

const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const TOKEN_KEY = 'auth_token';

export function getBaseUrl() {
  return DEFAULT_BASE_URL.replace(/\/$/, '');
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (_) {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (_) {
    // ignore storage errors
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (_) {
    // ignore
  }
}

export async function request(path, { method = 'GET', body, headers = {}, credentials } = {}) {
  const token = getToken();
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  } else {
    // Light diagnostic to help during auth-protected calls
    const isOrdersEndpoint = (path || '').startsWith('/orders') || (path || '').startsWith('orders');
    const isWrite = (method || 'GET').toUpperCase() !== 'GET';
    if (isOrdersEndpoint && isWrite) {
      // eslint-disable-next-line no-console
      console.warn('[api] No auth token found for a protected request:', method, path);
    }
  }

  const res = await fetch(`${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // do not include credentials by default; JWT is carried in Authorization header
    credentials: credentials ?? 'omit',
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    // Not JSON; return raw text (useful for /auth/login which returns a plain string JWT)
    data = text;
  }

  if (!res.ok) {
    let message = null;
    if (data) {
      message = (data.message) || (typeof data === 'string' ? data : null);
    }
    if (!message) {
      message = `${res.status} ${res.statusText || 'Request failed'}`;
    }
    if (res.status === 401) {
      message = 'Unauthorized. Please log in again to continue.';
    } else if (res.status === 403) {
      message = 'Forbidden. Your account does not have permission for this action.';
    }
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Upload a product image (ADMIN only). 'file' should be a File object from an <input type="file" />.
export async function uploadProductImage(productId, file) {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${getBaseUrl()}/products/${productId}/image`, {
    method: 'POST',
    headers,
    body: form,
    credentials: 'omit',
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
  if (!res.ok) {
    const message = (data && data.message) || `${res.status} ${res.statusText || 'Upload failed'}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data; // should be the updated Product entity with imageUrl
}

// Decode a JWT without verifying signature (for client-side reading only)
export function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(payload);
    return JSON.parse(json);
  } catch (_e) {
    return null;
  }
}

export { TOKEN_KEY };
