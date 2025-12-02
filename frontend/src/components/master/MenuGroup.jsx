// src/components/master/MenuGroup.jsx
import React, { useState } from 'react';
import { Plus, FileSpreadsheet, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MasterLayout from '../master/MasterLayout';
import MenuGroupForm from '../master/MenuGroupForm';

const PRIMARY_BLUE = '#3673B4';

const MenuGroup = () => {
  /* ---------- STATE ---------- */
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    category: '',
    name: '',
    status: 'active',
  });

  /* ---------- HELPERS ---------- */
  const resetForm = () => {
    setForm({ category: '', name: '', status: 'active' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (groupData) => {
    if (editingId) {
      setGroups((prev) => prev.map((g) => (g.id === editingId ? groupData : g)));
      toast.success('Menu Group updated successfully!');
    } else {
      setGroups((prev) => [...prev, { ...groupData, id: Date.now() }]);
      toast.success('Menu Group created successfully!');
    }
    resetForm();
  };

  const handleEdit = (group) => {
    setForm({
      category: group.category,
      name: group.name,
      status: group.status,
    });
    setEditingId(group.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu group?')) {
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success('Menu Group deleted.');
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <MasterLayout title="Menu Group">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Group</h1>
              <p className="text-sm text-gray-600">Create menu group for your restaurant</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Menu Group
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
            <MenuGroupForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              onSave={handleSave}
              onCancel={resetForm}
            />
          )}

          {/* ---------- EMPTY STATE ---------- */}
          {groups.length === 0 && !showForm && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! No Menu Group created yet...
              </h2>
              <p className="text-sm text-gray-600 mb-6 max-w-md text-center">
                There's nothing to view right now. Please create a new menu group to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <Plus className="w-5 h-5" />
                Create Menu Group
              </button>
            </div>
          )}

          {/* ---------- TABLE LIST ---------- */}
          {groups.length > 0 && !showForm && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu Group Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groups.map((group, idx) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{group.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${group.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-sm font-medium capitalize">{group.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEdit(group)} className="text-blue-600 hover:text-blue-800" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(group.id)} className="text-red-600 hover:text-red-800" title="Delete">
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
      </div>
    </MasterLayout>
  );
};

export default MenuGroup;