import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, RefreshCw, AlertCircle, Share2, Calendar, FileText } from 'lucide-react';

export function DistributionsView() {
  const [distributions, setDistributions] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    request_id: '',
    resource_id: '',
    quantity_distributed: 10,
    notes: 'Dispatched via emergency response vehicle.',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [distData, resData] = await Promise.all([
        api.getDistributions(),
        api.getResources(),
      ]);
      setDistributions(Array.isArray(distData) ? distData : []);
      const resList = Array.isArray(resData) ? resData : [];
      setResources(resList);
      if (resList.length > 0 && !formData.resource_id) {
        setFormData((prev) => ({ ...prev, resource_id: resList[0].resource_id }));
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
      await api.createDistribution({
        ...formData,
        resource_id: Number(formData.resource_id),
        quantity_distributed: Number(formData.quantity_distributed),
      });
      setIsModalOpen(false);
      setFormData({
        request_id: '',
        resource_id: resources[0]?.resource_id || '',
        quantity_distributed: 10,
        notes: '',
      });
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
          <h2 className="text-2xl font-bold text-[#172033]">Resource Distribution Ledger</h2>
          <p className="text-sm text-[#5B6475]">
            Immutable log of aid supplies dispatched to verified citizen relief requests.
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
            Disburse Aid
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F9FC] border-b border-[#D8DEE8] text-[#5B6475] font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Distribution ID</th>
                <th className="px-5 py-3.5">Linked Request ID</th>
                <th className="px-5 py-3.5">Resource ID</th>
                <th className="px-5 py-3.5">Quantity Disbursed</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Dispatch Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DEE8]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#5B6475]">
                    Loading distribution records...
                  </td>
                </tr>
              ) : distributions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#5B6475]">
                    No aid distributions logged yet.
                  </td>
                </tr>
              ) : (
                distributions.map((d) => (
                  <tr key={d.distribution_id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-[#1D4ED8]">
                      #{d.distribution_id}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-700">
                      {d.request_id}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5B6475]">
                      Item ID: {d.resource_id}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                        {d.quantity_distributed} units
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5B6475]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {d.distributed_at ? new Date(d.distributed_at).toLocaleString() : 'Just now'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5B6475] max-w-xs truncate">
                      {d.notes || 'Standard dispatch'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#172033] mb-4">Record Aid Disbursement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Target Request ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REQ-001 or Request UUID"
                  value={formData.request_id}
                  onChange={(e) => setFormData({ ...formData, request_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Stocked Resource *</label>
                <select
                  required
                  value={formData.resource_id}
                  onChange={(e) => setFormData({ ...formData, resource_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                >
                  {resources.map((r) => (
                    <option key={r.resource_id} value={r.resource_id}>
                      {r.item_name} ({r.quantity_available} {r.unit || 'units'} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Disbursement Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity_distributed}
                  onChange={(e) => setFormData({ ...formData, quantity_distributed: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Notes / Dispatch Unit</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Driver name, vehicle registration, delivery confirmation..."
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
                  {submitting ? 'Recording...' : 'Confirm Disbursement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
