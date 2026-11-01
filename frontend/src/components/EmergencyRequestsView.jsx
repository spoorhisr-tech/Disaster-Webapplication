import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { StatusBadge } from './StatusBadge';
import { Plus, RefreshCw, AlertCircle, Phone, MapPin, Users, CheckCircle2, XCircle, Home } from 'lucide-react';

export function EmergencyRequestsView() {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    disaster_event_id: '',
    request_type: 'Drinking Water & Rations',
    description: '',
    location_name: '',
    shelter_id: '',
    people_affected: 4,
    priority: 'high',
    requester_name: '',
    requester_phone: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqData, eventData, shelterData] = await Promise.all([
        api.getEmergencyRequests(),
        api.getDisasterEvents(),
        api.getShelters().catch(() => []),
      ]);
      setRequests(Array.isArray(reqData) ? reqData : []);
      const eventList = Array.isArray(eventData) ? eventData : [];
      setEvents(eventList);
      setShelters(Array.isArray(shelterData) ? shelterData : []);
      if (eventList.length > 0 && !formData.disaster_event_id) {
        setFormData((prev) => ({ ...prev, disaster_event_id: eventList[0].id }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createEmergencyRequest({
        ...formData,
        disaster_event_id: Number(formData.disaster_event_id),
        people_affected: Number(formData.people_affected),
        shelter_id: formData.shelter_id ? Number(formData.shelter_id) : undefined,
      });
      setIsModalOpen(false);
      setFormData({
        disaster_event_id: events[0]?.id || '',
        request_type: 'Drinking Water & Rations',
        description: '',
        location_name: '',
        shelter_id: '',
        people_affected: 4,
        priority: 'high',
        requester_name: '',
        requester_phone: '',
      });
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateEmergencyRequest(id, { status: newStatus });
      await fetchData();
    } catch (err) {
      alert(`Status transition rejected: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#172033]">Emergency Requests</h2>
          <p className="text-sm text-[#5B6475]">
            Urgent citizen requests for rescue, drinking water, medical aid, and shelter.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
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
            Submit Request
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F9FC] border-b border-[#D8DEE8] text-[#5B6475] font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Ticket #</th>
                <th className="px-5 py-3.5">Requester & Location</th>
                <th className="px-5 py-3.5">Assistance Needed</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DEE8]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#5B6475]">
                    Loading emergency requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5B6475]">
                    No emergency requests pending.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono font-semibold text-xs text-[#1D4ED8]">
                      {req.request_number}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#172033]">{req.requester_name}</div>
                      <div className="flex items-center gap-3 text-xs text-[#5B6475] mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {req.location_name}
                        </span>
                        {req.requester_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {req.requester_phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#172033]">{req.request_type}</div>
                      <div className="text-xs text-[#5B6475] mt-0.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {req.people_affected} people affected
                      </div>
                      {req.shelter && (
                        <div className="text-xs text-teal-700 font-medium mt-1 inline-flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          <Home className="w-3 h-3 text-teal-600" />
                          <span>Assigned: {req.shelter.shelter_name} ({req.shelter.area})</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={req.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(req.id, 'approved')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(req.id, 'rejected')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-semibold cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                      {req.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(req.id, 'fulfilled')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Fulfilled
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#172033] mb-4">Submit Emergency Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Related Disaster Event *</label>
                <select
                  required
                  value={formData.disaster_event_id}
                  onChange={(e) => setFormData({ ...formData, disaster_event_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.location_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Requester Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Citizen name"
                    value={formData.requester_name}
                    onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.requester_phone}
                    onChange={(e) => setFormData({ ...formData, requester_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Location Details *</label>
                <input
                  type="text"
                  required
                  placeholder="Street, Landmark, City"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Assistance Type *</label>
                  <select
                    value={formData.request_type}
                    onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  >
                    <option value="Drinking Water & Rations">Drinking Water & Rations</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Emergency Rescue Boat">Emergency Rescue Boat</option>
                    <option value="Temporary Shelter">Temporary Shelter</option>
                    <option value="Blankets & Clothing">Blankets & Clothing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Urgency Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  >
                    <option value="critical">Critical (Immediate danger)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {formData.request_type === 'Temporary Shelter' && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-teal-900">
                      Evacuation Shelter Placement
                    </label>
                    <span className="text-[11px] text-teal-700">Auto-matches Area or choose below</span>
                  </div>
                  <select
                    value={formData.shelter_id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const matched = shelters.find((s) => String(s.shelter_id) === String(selectedId));
                      setFormData({
                        ...formData,
                        shelter_id: selectedId,
                        location_name: matched ? matched.area : formData.location_name,
                      });
                    }}
                    className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm bg-white"
                  >
                    <option value="">-- Auto-match shelter by Location Area --</option>
                    {shelters.map((s) => {
                      const avail = (Number(s.capacity) || 0) - (Number(s.current_occupancy) || 0);
                      const isFull = s.status === 'FULL' || avail <= 0;
                      return (
                        <option key={s.shelter_id} value={s.shelter_id} disabled={isFull}>
                          {s.shelter_name} ({s.area}) — {isFull ? 'FULL' : `${avail} spots available`}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-teal-700">
                    💡 If left on Auto-match, dispatching will match the open shelter in <strong className="font-semibold">{formData.location_name || 'your location area'}</strong> and update its live capacity automatically.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Number of People Affected *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.people_affected}
                  onChange={(e) => setFormData({ ...formData, people_affected: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Emergency Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Elderly citizen trapped on first floor, needs insulin..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {submitting ? 'Submitting...' : 'Dispatch Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
