import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, RefreshCw, AlertCircle, Package, Edit2, Warehouse } from 'lucide-react';

export function ResourcesView() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    item_name: '',
    category: 'Food & Rations',
    quantity_available: 100,
    unit: 'boxes',
    warehouse_location: 'Central Depot - Koramangala',
  });

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      item_name: '',
      category: 'Food & Rations',
      quantity_available: 100,
      unit: 'boxes',
      warehouse_location: 'Central Depot - Koramangala',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingId(r.resource_id);
    setFormData({
      item_name: r.item_name,
      category: r.category,
      quantity_available: r.quantity_available,
      unit: r.unit || 'units',
      warehouse_location: r.warehouse_location,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        quantity_available: Number(formData.quantity_available),
      };
      if (editingId) {
        await api.updateResource(editingId, payload);
      } else {
        await api.createResource(payload);
      }
      setIsModalOpen(false);
      await fetchResources();
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
          <h2 className="text-2xl font-bold text-[#172033]">Resource Supplies & Inventory</h2>
          <p className="text-sm text-[#5B6475]">
            Relief supplies stocked across emergency warehouses and depots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchResources}
            className="p-2 text-[#5B6475] hover:text-[#172033] rounded-lg border border-[#D8DEE8] bg-white hover:bg-gray-50 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-medium rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Stock New Item
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resource Table */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F9FC] border-b border-[#D8DEE8] text-[#5B6475] font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item Name & Category</th>
                <th className="px-5 py-3.5">Available Stock</th>
                <th className="px-5 py-3.5">Warehouse Location</th>
                <th className="px-5 py-3.5">Stock Health</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DEE8]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#5B6475]">
                    Loading warehouse supplies...
                  </td>
                </tr>
              ) : resources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#5B6475]">
                    No resources stocked in inventory.
                  </td>
                </tr>
              ) : (
                resources.map((r) => {
                  const qty = Number(r.quantity_available);
                  const isLow = qty < 50;
                  return (
                    <tr key={r.resource_id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#172033] flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#1D4ED8]" />
                          {r.item_name}
                        </div>
                        <div className="text-xs text-[#5B6475] mt-0.5">{r.category}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-base font-extrabold text-[#172033]">
                          {qty.toLocaleString()}
                        </span>{' '}
                        <span className="text-xs text-[#5B6475]">{r.unit || 'units'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#5B6475]">
                          <Warehouse className="w-3.5 h-3.5 text-gray-400" />
                          {r.warehouse_location}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Low Stock Warning
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Healthy Inventory
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openEditModal(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#1D4ED8] hover:bg-blue-50 rounded font-medium cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D8DEE8] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#172033] mb-4">
              {editingId ? 'Adjust Resource Stock' : 'Stock New Resource'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Drinking Water 20L"
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                >
                  <option value="Food & Rations">Food & Rations</option>
                  <option value="Drinking Water">Drinking Water</option>
                  <option value="Medical & First Aid">Medical & First Aid</option>
                  <option value="Bedding & Shelter">Bedding & Shelter</option>
                  <option value="Rescue Equipment">Rescue Equipment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity_available}
                    onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="cans, boxes, kg"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D8DEE8] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Warehouse Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hub 3, Whitefield"
                  value={formData.warehouse_location}
                  onChange={(e) => setFormData({ ...formData, warehouse_location: e.target.value })}
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
                  {submitting ? 'Saving...' : editingId ? 'Update Stock' : 'Register Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
