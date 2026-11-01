import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { StatusBadge } from './StatusBadge';
import { Plus, Trash2, MapPin, Users, AlertCircle, RefreshCw } from 'lucide-react';

export function DisasterEventsView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'Flood',
    severity: 'high',
    status: 'active',
    description: '',
    location_name: '',
    latitude: 12.9716,
    longitude: 77.5946,
    radius_km: 10,
    affected_population: 500,
  });

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDisasterEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        radius_km: Number(formData.radius_km),
        affected_population: Number(formData.affected_population),
      };
      await api.createDisasterEvent(payload);
      setIsModalOpen(false);
      setFormData({
        title: '',
        slug: '',
        type: 'Flood',
        severity: 'high',
        status: 'active',
        description: '',
        location_name: '',
        latitude: 12.9716,
        longitude: 77.5946,
        radius_km: 10,
        affected_population: 500,
      });
      await fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Disaster Event #${id}?`)) return;
    try {
      await api.deleteDisasterEvent(id);
      await fetchEvents();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#172033]">Disaster Events</h2>
          <p className="text-sm text-[#5B6475]">
            Active and declared emergency disaster events requiring relief coordination.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvents}
            className="p-2 text-[#5B6475] hover:text-[#172033] rounded-lg border border-[#D8DEE8] bg-white hover:bg-gray-50 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Declare Disaster Event
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-[#D8DEE8] animate-pulse h-48" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[#D8DEE8]">
          <AlertCircle className="w-12 h-12 text-[#5B6475] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-[#172033]">No Disaster Events Recorded</h3>
          <p className="text-sm text-[#5B6475] mt-1">
            Click "Declare Disaster Event" above to record a new emergency incident.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-xl border border-[#D8DEE8] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
                      {evt.type}
                    </span>
                    <h3 className="text-lg font-bold text-[#172033] mt-0.5">{evt.title}</h3>
                  </div>
                  <StatusBadge status={evt.severity} />
                </div>

                <p className="text-sm text-[#5B6475] line-clamp-2 mb-4">
                  {evt.description || 'No detailed description provided.'}
                </p>

                <div className="space-y-2 text-xs text-[#5B6475] border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{evt.location_name} (Radius: {evt.radius_km || 0} km)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Est. Affected: {evt.affected_population?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8DEE8] flex items-center justify-between">
                <StatusBadge status={evt.status} />
                <button
                  onClick={() => handleDelete(evt.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#172033] mb-4">Declare New Disaster Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru Flash Flood 2026"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, title, slug });
                  }}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Slug Identifier *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm bg-gray-50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Disaster Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  >
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Wildfire">Wildfire</option>
                    <option value="Landslide">Landslide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Severity *</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bellandur Ward, Bengaluru"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Impact Radius (km)</label>
                  <input
                    type="number"
                    value={formData.radius_km}
                    onChange={(e) => setFormData({ ...formData, radius_km: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Affected Population</label>
                  <input
                    type="number"
                    value={formData.affected_population}
                    onChange={(e) => setFormData({ ...formData, affected_population: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details regarding water levels, stranded citizens, accessibility..."
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8DEE8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D8DEE8] rounded-lg text-sm text-[#5B6475] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Registering...' : 'Declare Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
