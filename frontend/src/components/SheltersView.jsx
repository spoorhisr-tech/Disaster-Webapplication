import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, RefreshCw, AlertCircle, Home, Users, Phone, User, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function SheltersView() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shelter_name: '',
    area: '',
    capacity: 100,
    current_occupancy: 0,
    status: 'OPEN',
    contact_person: '',
    contact_phone: '',
  });

  const fetchShelters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getShelters();
      setShelters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createShelter({
        ...formData,
        capacity: Number(formData.capacity),
        current_occupancy: Number(formData.current_occupancy),
      });
      setIsModalOpen(false);
      setFormData({
        shelter_name: '',
        area: '',
        capacity: 100,
        current_occupancy: 0,
        status: 'OPEN',
        contact_person: '',
        contact_phone: '',
      });
      await fetchShelters();
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
          <h2 className="text-2xl font-bold text-[#172033]">Emergency Shelters</h2>
          <p className="text-sm text-[#5B6475]">
            Relief camps, community halls, and safe temporary evacuation shelters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchShelters}
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
            Add Shelter
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-[#D8DEE8] animate-pulse h-48" />
          ))}
        </div>
      ) : shelters.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[#D8DEE8]">
          <Home className="w-12 h-12 text-[#5B6475] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-[#172033]">No Shelters Configured</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((s) => {
            const cap = Number(s.capacity) || 1;
            const occ = Number(s.current_occupancy) || 0;
            const pct = Math.min(100, Math.round((occ / cap) * 100));
            const isFull = occ >= cap;

            return (
              <div
                key={s.shelter_id}
                className="bg-white rounded-xl border border-[#D8DEE8] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-bold text-[#172033] flex items-center gap-2">
                      <Home className="w-5 h-5 text-[#0F766E]" />
                      {s.shelter_name}
                    </h3>
                    <StatusBadge status={isFull ? 'critical' : s.status.toLowerCase()} label={isFull ? 'SHELTER FULL' : s.status} />
                  </div>

                  <p className="text-xs font-medium text-[#5B6475] mb-4">Area: {s.area}</p>

                  {/* Occupancy bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#5B6475]">Occupancy ({occ} / {cap})</span>
                      <span className={pct > 90 ? 'text-rose-600' : 'text-[#0F766E]'}>{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          pct >= 100 ? 'bg-rose-600' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#5B6475] border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>Coordinator: {s.contact_person || 'Facility Incharge'}</span>
                    </div>
                    {s.contact_phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{s.contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#172033] mb-4">Register Emergency Shelter</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Shelter Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Government Higher Secondary Hall"
                  value={formData.shelter_name}
                  onChange={(e) => setFormData({ ...formData, shelter_name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">District / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtown Sector 4"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Max Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Current Occupancy</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_occupancy}
                    onChange={(e) => setFormData({ ...formData, current_occupancy: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
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
                  {submitting ? 'Registering...' : 'Save Shelter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
