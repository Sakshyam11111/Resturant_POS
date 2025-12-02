// src/components/master/MenuGroupForm.jsx
import React from 'react';
import { X } from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';

const MenuGroupForm = ({ form, setForm, editingId, onSave, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const groupData = {
      id: editingId || Date.now(),
      category: form.category,
      name: form.name,
      status: form.status,
    };
    onSave(groupData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {editingId ? 'Edit Menu Group' : 'Menu Group Setting'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            required
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Momo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Menu Group Name</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Beverage"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ backgroundColor: PRIMARY_BLUE }}
            className="px-6 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition shadow-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuGroupForm;