import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, RefreshCw, AlertCircle, HeartHandshake, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function VolunteersView() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skills: '',
    assigned_area: '',
    is_available: true,
  });

  const fetchVolunteers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getVolunteers();
      setVolunteers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const toggleAvailability = async (v) => {
    try {
      await api.updateVolunteer(v.volunteer_id, {
        is_available: !v.is_available,
      });
      await fetchVolunteers();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createVolunteer(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        phone: '',
        skills: '',
        assigned_area: '',
        is_available: true,
      });
      await fetchVolunteers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#172033]">Volunteer Relief Force</h2>
          <p className="text-sm text-[#5B6475]">
            Registered volunteers, drivers, healthcare workers, and disaster response staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchVolunteers}
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
            Enroll Volunteer
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-[#D8DEE8] animate-pulse h-32" />
          ))}
        </div>
      ) : volunteers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[#D8DEE8]">
          <HeartHandshake className="w-12 h-12 text-[#5B6475] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-[#172033]">No Volunteers Enrolled</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volunteers.map((v) => (
            <div
              key={v.volunteer_id}
              className="bg-white rounded-xl border border-[#D8DEE8] p-5 shadow-xs hover:shadow-md transition flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#172033]">{v.name}</h3>
                  <StatusBadge
                    status={v.is_available ? 'available' : 'allocated'}
                    label={v.is_available ? 'Ready for Deployment' : 'On Assignment'}
                  />
                </div>

                <p className="text-xs font-semibold text-[#1D4ED8] bg-blue-50/70 inline-block px-2 py-0.5 rounded border border-blue-100 mb-3">
                  Skills: {v.skills}
                </p>

                <div className="space-y-1 text-xs text-[#5B6475]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Deployment Base: {v.assigned_area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{v.phone}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleAvailability(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  v.is_available
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                {v.is_available ? 'Assign to Field' : 'Mark Available'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#172033] mb-4">Enroll Volunteer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Specialized Skills *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paramedic, Heavy Vehicle Driver, Diver"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Deployment Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Valley / Riverfront"
                  value={formData.assigned_area}
                  onChange={(e) => setFormData({ ...formData, assigned_area: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
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
                  {submitting ? 'Enrolling...' : 'Enroll Volunteer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
