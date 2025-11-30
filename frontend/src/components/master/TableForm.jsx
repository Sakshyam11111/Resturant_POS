// src/components/TableForm.jsx
import React, { useEffect } from 'react';
import { QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIMARY_BLUE = '#3673B4';

const TableForm = ({ 
  form, 
  setForm, 
  editingId, 
  onSave, 
  onCancel, 
  onGenerateQR 
}) => {
  const handleNumericInput = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!editingId) {
      document.getElementById('table-number-input')?.focus();
    }
  }, [editingId]);

  const handleSave = () => {
    if (!form.number || !form.name || !form.capacity) {
      toast.error('Please fill in Table Number, Name, and Capacity.');
      return;
    }
    if (isNaN(form.capacity) || form.capacity <= 0) {
      toast.error('Capacity must be a positive number.');
      return;
    }

    const tableData = {
      id: editingId || Date.now(),
      no: form.number,
      name: form.name,
      seats: parseInt(form.capacity, 10),
      status: form.status,
      floor: form.location === 'first' ? 'Main Hall' : 'Second Floor',
    };

    onSave(tableData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {editingId ? 'Edit Table' : 'Add New Table'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Table Number – numbers only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
          <input
            id="table-number-input"
            type="number"
            inputMode="numeric"
            name="number"
            value={form.number}
            onChange={handleNumericInput}
            placeholder="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Seating Capacity – numbers only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
          <input
            type="number"
            inputMode="numeric"
            name="capacity"
            value={form.capacity}
            onChange={handleNumericInput}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Status & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            name="location"
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="first">First Floor</option>
            <option value="second">Second Floor</option>
          </select>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <button
              onClick={() => onGenerateQR(form)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              <QrCode className="w-4 h-4" />
              Generate QR Code
            </button>
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p><strong>QR Code will contain:</strong></p>
              <ul className="list-disc list-inside text-gray-500">
                <li>Table Number: {form.number || 'N/A'}</li>
                <li>Table Name: {form.name || 'N/A'}</li>
                <li>Location: {form.location === 'first' ? 'First Floor' : 'Second Floor'}</li>
                <li>Capacity: {form.capacity || 'N/A'}</li>
              </ul>
            </div>
          </div>
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <QrCode className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">QR Code will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{ backgroundColor: PRIMARY_BLUE }}
          className="px-5 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition shadow-sm"
        >
          {editingId ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default TableForm;