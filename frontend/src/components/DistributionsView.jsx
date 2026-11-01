import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, RefreshCw, AlertCircle, Calendar } from 'lucide-react';

export function DistributionsView() {
  const [distributions, setDistributions] = useState([]);
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    request_id: '',
    resource_id: '',
    quantity_distributed: 1,
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [distData, resData, reqData] = await Promise.all([
        api.getDistributions(),
        api.getResources(),
        api.getReliefRequests(),
      ]);
      setDistributions(Array.isArray(distData) ? distData : []);
      const resList = Array.isArray(resData) ? resData : [];
      const reqList = Array.isArray(reqData) ? reqData : [];
      setResources(resList);
      setRequests(reqList);

      if (reqList.length > 0 && !formData.request_id) {
        setFormData((prev) => ({
          ...prev,
          request_id: reqList[0].request_id,
          resource_id: resList[0]?.resource_id || '',
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

  const openModal = () => {
    setError(null);
    const activeReq = requests.find((r) => r.status !== 'RESOLVED') || requests[0];
    setFormData({
      request_id: activeReq?.request_id || '',
      resource_id: resources[0]?.resource_id || '',
      quantity_distributed: activeReq?.quantity_needed || 1,
      notes: '',
    });
    setIsModalOpen(true);
  };

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
            onClick={openModal}
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
                      Item #{d.resource_id}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-xs">
                        {d.quantity_distributed} units
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5B6475]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {d.distributed_at ? new Date(d.distributed_at).toLocaleString() : 'Recent'}
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

      {/* Modal Connected to Database */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#172033] mb-4">Record Aid Disbursement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Select Pending Database Request *
                </label>
                <select
                  required
                  value={formData.request_id}
                  onChange={(e) => {
                    const reqId = e.target.value;
                    const selected = requests.find((r) => r.request_id === reqId);
                    setFormData({
                      ...formData,
                      request_id: reqId,
                      quantity_distributed: selected ? selected.quantity_needed : formData.quantity_distributed,
                    });
                  }}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm bg-white"
                >
                  {requests.map((r) => (
                    <option key={r.request_id} value={r.request_id}>
                      {r.request_id} — {r.citizen_name} ({r.resource_type_needed}, Need: {r.quantity_needed}) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Stocked Warehouse Supply *
                </label>
                <select
                  required
                  value={formData.resource_id}
                  onChange={(e) => setFormData({ ...formData, resource_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm bg-white"
                >
                  {resources.map((r) => (
                    <option key={r.resource_id} value={r.resource_id}>
                      {r.item_name} ({r.quantity_available} {r.unit || 'units'} in {r.warehouse_location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Disbursement Quantity *
                </label>
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
                <label className="block text-xs font-semibold text-[#172033] mb-1">Dispatch Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Volunteer name, vehicle info, delivery confirmation..."
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
