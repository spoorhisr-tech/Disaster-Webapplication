// Central API service for connecting to Laravel Backend (http://localhost:8000/api)
const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // 1. Disaster Events
  getDisasterEvents: () => request('/disaster-events'),
  getDisasterEvent: (id) => request(`/disaster-events/${id}`),
  createDisasterEvent: (data) => request('/disaster-events', { method: 'POST', body: JSON.stringify(data) }),
  updateDisasterEvent: (id, data) => request(`/disaster-events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDisasterEvent: (id) => request(`/disaster-events/${id}`, { method: 'DELETE' }),

  // 2. Emergency Requests
  getEmergencyRequests: () => request('/emergency-requests'),
  getEmergencyRequest: (id) => request(`/emergency-requests/${id}`),
  createEmergencyRequest: (data) => request('/emergency-requests', { method: 'POST', body: JSON.stringify(data) }),
  updateEmergencyRequest: (id, data) => request(`/emergency-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 3. Incident Reports
  getIncidentReports: () => request('/incident-reports'),
  getIncidentReport: (id) => request(`/incident-reports/${id}`),
  createIncidentReport: (data) => request('/incident-reports', { method: 'POST', body: JSON.stringify(data) }),

  // 4. Resources
  getResources: () => request('/resources'),
  getResource: (id) => request(`/resources/${id}`),
  createResource: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id, data) => request(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 5. Distributions
  getDistributions: () => request('/distributions'),
  getDistribution: (id) => request(`/distributions/${id}`),
  createDistribution: (data) => request('/distributions', { method: 'POST', body: JSON.stringify(data) }),
};
