// Central API service connecting to Laravel Backend via Vite Proxy
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

  // 4. Warehouse Resources
  getResources: () => request('/resources'),
  getResource: (id) => request(`/resources/${id}`),
  createResource: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id, data) => request(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 5. Aid Distributions
  getDistributions: () => request('/distributions'),
  getDistribution: (id) => request(`/distributions/${id}`),
  createDistribution: (data) => request('/distributions', { method: 'POST', body: JSON.stringify(data) }),

  // 6. Shelters (Real DB Table)
  getShelters: () => request('/shelters'),
  getShelter: (id) => request(`/shelters/${id}`),
  createShelter: (data) => request('/shelters', { method: 'POST', body: JSON.stringify(data) }),
  updateShelter: (id, data) => request(`/shelters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 7. Volunteers (Real DB Table)
  getVolunteers: () => request('/volunteers'),
  getVolunteer: (id) => request(`/volunteers/${id}`),
  createVolunteer: (data) => request('/volunteers', { method: 'POST', body: JSON.stringify(data) }),
  updateVolunteer: (id, data) => request(`/volunteers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 8. Relief Requests (Real DB Table matching distributions)
  getReliefRequests: () => request('/relief-requests'),
  getReliefRequest: (id) => request(`/relief-requests/${id}`),
  createReliefRequest: (data) => request('/relief-requests', { method: 'POST', body: JSON.stringify(data) }),
  updateReliefRequest: (id, data) => request(`/relief-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
