// src/components/master/MenuCreate.jsx
import React, { useState } from 'react';
import { Plus, FileSpreadsheet, QrCode, Edit2, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import MasterLayout from '../master/MasterLayout';
import MenuForm from '../master/MenuForm';

const PRIMARY_BLUE = '#3673B4';

const MenuCreate = () => {
  /* ---------- STATE ---------- */
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);

  const [form, setForm] = useState({
    group: '',
    category: '',
    name: '',
    printType: '',
    price: '',
    description: '',
    image: null,
  });

  /* ---------- HELPERS ---------- */
  const resetForm = () => {
    setForm({
      group: '',
      category: '',
      name: '',
      printType: '',
      price: '',
      description: '',
      image: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (menuData) => {
    if (editingId) {
      setMenus((prev) => prev.map((m) => (m.id === editingId ? menuData : m)));
      toast.success('Menu updated successfully!');
    } else {
      setMenus((prev) => [...prev, { ...menuData, id: Date.now() }]);
      toast.success('Menu created successfully!');
    }
    resetForm();
  };

  const handleEdit = (menu) => {
    setForm({
      group: menu.group,
      category: menu.category,
      name: menu.name,
      printType: menu.printType,
      price: menu.price.toString(),
      description: menu.description,
      image: menu.image,
    });
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      setMenus((prev) => prev.filter((m) => m.id !== id));
      toast.success('Menu deleted.');
    }
  };

  const generateQR = (formData) => {
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required to generate QR.');
      return;
    }
    const data = {
      name: formData.name,
      group: formData.group,
      price: formData.price,
      description: formData.description,
    };
    setQrData(data);
    setShowQRModal(true);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR-Menu-${form.name || 'item'}.png`;
    a.click();
  };

  /* ---------- RENDER ---------- */
  return (
    <MasterLayout title="Menu Create">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menu</h1>
              <p className="text-sm text-gray-600">Manage your menu items</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Menu
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
            <MenuForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              onSave={handleSave}
              onCancel={resetForm}
              onGenerateQR={generateQR}
            />
          )}

          {/* ---------- EMPTY STATE ---------- */}
          {menus.length === 0 && !showForm && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No menu created yet
              </h2>
              <p className="text-sm text-gray-600 mb-6 max-w-md text-center">
                There's nothing to view right now. Create a new menu to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <Plus className="w-5 h-5" />
                Create Menu
              </button>
            </div>
          )}

          {/* ---------- TABLE LIST ---------- */}
          {menus.length > 0 && !showForm && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menus.map((menu, idx) => (
                      <tr key={menu.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {menu.image ? (
                            <img
                              src={menu.image}
                              alt={menu.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{menu.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{menu.group}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {menu.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEdit(menu)} className="text-blue-600 hover:text-blue-800" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(menu.id)} className="text-red-600 hover:text-red-800" title="Delete">
                              <Trash2 className="w-4 h-4" />
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
              <h3 className="text-lg font-semibold mb-4">Menu QR Code</h3>
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
                <p><strong>Name:</strong> {qrData.name}</p>
                <p><strong>Group:</strong> {qrData.group}</p>
                <p><strong>Price:</strong> Rs. {qrData.price}</p>
                {qrData.description && <p><strong>Desc:</strong> {qrData.description}</p>}
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

export default MenuCreate;