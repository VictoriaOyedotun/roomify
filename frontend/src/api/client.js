const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getToken() {
  return localStorage.getItem('roomify_token');
}

export async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('roomify_token');
    localStorage.removeItem('roomify_user');
    window.dispatchEvent(new Event('roomify-unauthorized'));
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.message || (typeof data.errors === 'object' ? Object.values(data.errors).flat().join(', ') : null) || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const auth = {
  register: (email, password, displayName) =>
    api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName: displayName || undefined }),
    }),
  login: (email, password) =>
    api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const users = {
  getMe: () => api('/api/users/me'),
  updateMe: (data) => api('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
};

export const listings = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/api/listings${q ? `?${q}` : ''}`);
  },
  getById: (id) => api(`/api/listings/${id}`),
  myListings: () => api('/api/listings/my'),
  create: (data) => api('/api/listings', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api(`/api/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => api(`/api/listings/${id}`, { method: 'DELETE' }),
};

export const matchmaking = {
  getQuestions: () => api('/api/matchmaking/questions'),
  submitAnswers: (data) => api('/api/matchmaking/answers', { method: 'POST', body: JSON.stringify(data) }),
  getRecommendations: () => api('/api/matchmaking/recommendations'),
};
