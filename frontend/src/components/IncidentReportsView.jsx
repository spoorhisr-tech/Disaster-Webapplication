import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { StatusBadge } from './StatusBadge';
import { Plus, RefreshCw, AlertCircle, FileText, MapPin, Phone, User } from 'lucide-react';

export function IncidentReportsView() {
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    disaster_event_id: '',
    ticket_number: '',
    incident_type: 'Structural Collapse',
    urgency: 'high',
    status: 'reported',
    title: '',
    description: '',
    location_name: '',
    latitude: 12.9716,
    longitude: 77.5946,
    reporter_name: '',
    reporter_phone: '',
    people_affected: 2,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [repData, eventData] = await Promise.all([
        api.getIncidentReports(),
        api.getDisasterEvents(),
      ]);
      setReports(Array.isArray(repData) ? repData : []);
      const eventList = Array.isArray(eventData) ? eventData : [];
      setEvents(eventList);
      if (eventList.length > 0 && !formData.disaster_event_id) {
        setFormData((prev) => ({
          ...prev,
          disaster_event_id: eventList[0].id,
          ticket_number: 'INC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        }));
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

  const openNewModal = () => {
    setFormData({
      disaster_event_id: events[0]?.id || '',
      ticket_number: 'INC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      incident_type: 'Structural Collapse',
      urgency: 'high',
      status: 'reported',
      title: '',
      description: '',
      location_name: '',
      latitude: 12.9716,
      longitude: 77.5946,
      reporter_name: '',
      reporter_phone: '',
      people_affected: 2,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createIncidentReport({
        ...formData,
        disaster_event_id: Number(formData.disaster_event_id),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        people_affected: Number(formData.people_affected),
      });
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#172033]">Incident Reports</h2>
          <p className="text-sm text-[#5B6475]">
            Verified field incident reports filed by volunteers and affected communities.
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
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            File Incident Report
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-[#D8DEE8] animate-pulse h-40" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[#D8DEE8]">
          <FileText className="w-12 h-12 text-[#5B6475] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-[#172033]">No Incidents Reported</h3>
          <p className="text-sm text-[#5B6475] mt-1">
            All current zones reporting clear. Click above to file a field observation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-xl border border-[#D8DEE8] p-5 shadow-xs hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1D4ED8]">
                    {rep.ticket_number}
                  </span>
                  <h3 className="text-base font-bold text-[#172033] mt-0.5">{rep.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={rep.urgency} />
                  <StatusBadge status={rep.status} />
                </div>
              </div>

              <p className="text-sm text-[#5B6475] mb-4">
                {rep.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#5B6475] border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{rep.location_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Reporter: {rep.reporter_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{rep.reporter_phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Affected:</span> {rep.people_affected} people
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#172033] mb-4">File Field Incident</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Disaster Event *</label>
                <select
                  required
                  value={formData.disaster_event_id}
                  onChange={(e) => setFormData({ ...formData, disaster_event_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Incident Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Transformer Submerged"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Type *</label>
                  <select
                    value={formData.incident_type}
                    onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  >
                    <option value="Structural Collapse">Structural Collapse</option>
                    <option value="Road Blockade">Road Blockade</option>
                    <option value="Electrical Hazard">Electrical Hazard</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Water Contamination">Water Contamination</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Urgency *</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
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
                <label className="block text-xs font-semibold text-[#172033] mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="Address or landmark"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Reporter Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.reporter_name}
                    onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Reporter Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.reporter_phone}
                    onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
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
                  placeholder="Observation notes, immediate risks..."
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
                  {submitting ? 'Filing...' : 'Record Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
