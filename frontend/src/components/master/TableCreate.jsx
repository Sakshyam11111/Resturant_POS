// src/components/TableCreate.jsx
import React, { useState } from 'react';
import { Plus, FileSpreadsheet, QrCode, Edit2, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import MasterLayout from './MasterLayout';
import TableForm from './TableForm';

const PRIMARY_BLUE = '#3673B4';

const TableCreate = () => {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);

  const [form, setForm] = useState({
    number: '',
    name: '',
    capacity: '',
    status: 'active',
    location: 'first',
  });

  const resetForm = () => {
    setForm({ number: '', name: '', capacity: '', status: 'active', location: 'first' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (tableData) => {
    if (editingId) {
      setTables((prev) => prev.map((t) => (t.id === editingId ? tableData : t)));
      toast.success('Table updated successfully!');
    } else {
      setTables((prev) => [...prev, tableData]);
      toast.success('Table created successfully!');
    }
    resetForm();
  };

  const handleEdit = (table) => {
    setForm({
      number: table.no,
      name: table.name,
      capacity: table.seats.toString(),
      status: table.status,
      location: table.floor === 'Main Hall' ? 'first' : 'second',
    });
    setEditingId(table.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      setTables((prev) => prev.filter((t) => t.id !== id));
      toast.success('Table deleted.');
    }
  };

  const generateQR = (formData) => {
    if (!formData.number || !formData.name || !formData.capacity) {
      toast.error('Fill in all required fields to generate QR code.');
      return;
    }
    const data = {
      tableNumber: formData.number,
      tableName: formData.name,
      location: formData.location === 'first' ? 'First Floor' : 'Second Floor',
      capacity: formData.capacity,
    };
    setQrData(data);
    setShowQRModal(true);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR-Table-${form.number}.png`;
    a.click();
  };

  return (
    <MasterLayout title="Table Create">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Table</h1>
              <p className="text-sm text-gray-600">Manage your table</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Table
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                <FileSpreadsheet className="w-4 h-4" />
                Generate Excel
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">

          {/* ---------- FORM ---------- */}
          {showForm && (
            <TableForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              onSave={handleSave}
              onCancel={resetForm}
              onGenerateQR={generateQR}
            />
          )}

          {/* ---------- EMPTY STATE ---------- */}
          {tables.length === 0 && !showForm && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No table created yet
              </h2>
              <p className="text-sm text-gray-600 mb-6 max-w-md text-center">
                There's nothing to view right now. Create a new table to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <Plus className="w-5 h-5" />
                Create Table
              </button>
            </div>
          )}

          {/* ---------- TABLE LIST ---------- */}
          {tables.length > 0 && !showForm && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tables.map((table, index) => (
                      <tr key={table.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.seats} seats</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{table.floor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${table.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-sm font-medium capitalize">{table.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEdit(table)} className="text-blue-600 hover:text-blue-800" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(table.id)} className="text-red-600 hover:text-red-800" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setQrData({
                                  tableNumber: table.no,
                                  tableName: table.name,
                                  location: table.floor,
                                  capacity: table.seats,
                                });
                                setShowQRModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-800"
                              title="View QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ---------- QR MODAL ---------- */}
        {showQRModal && qrData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Table QR Code</h3>
              <div className="bg-white p-4 border rounded-lg flex justify-center mb-4">
                <QRCodeSVG
                  id="qr-canvas"
                  value={JSON.stringify(qrData)}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-xs text-gray-600 space-y-1 mb-4">
                <p><strong>Table:</strong> {qrData.tableName} ({qrData.tableNumber})</p>
                <p><strong>Location:</strong> {qrData.location}</p>
                <p><strong>Capacity:</strong> {qrData.capacity} seats</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadQR}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  style={{ backgroundColor: PRIMARY_BLUE }}
                  className="flex-1 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MasterLayout>
  );
};

export default TableCreate;