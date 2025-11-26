// src/components/OrderSidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Users, Search, Plus, Package as PackageIcon,
  Edit2, Trash2, MoreVertical, Check, AlertCircle, X
} from 'lucide-react';
import UnifiedEditForm from './UnifiedEditForm';

const API_URL = 'http://localhost:5000/api';

const ToastNotification = ({ message, type = 'success', onClose }) => {
  const isSuccess = type === 'success';
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
      <div className={`bg-white rounded-lg shadow-xl p-4 flex items-center space-x-3 border ${isSuccess ? 'border-gray-100' : 'border-red-100'}`}>
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
            {isSuccess ? <Check className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />}
          </div>
        </div>
        <div className="flex-1">
          <p className={`font-medium ${isSuccess ? 'text-gray-800' : 'text-red-800'}`}>{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const OrderSidebar = ({
  activeTab, setActiveTab,
  activityData, setActivityData,
  filteredData,
  isTakeawayActive,
  buttonText, buttonColor,
  setShowReservationForm,
  setShowTakeawayForm,
  tables, setTables, selectedFloor
}) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const openEdit = (item) => {
    setActiveMenu(null);
    setEditingItem(item);
  };

  const closeEdit = () => setEditingItem(null);

  const afterUpdate = (updated) => {
    const isRes = updated.tableNumber !== undefined;
    const newCard = isRes
      ? {
          id: updated._id || updated.id,
          type: 'reservation',
          name: updated.customerName,
          time: `${fmt(updated.fromTime)} - ${fmt(updated.toTime)}`,
          people: updated.guests,
          table: `Table #${updated.tableNumber}`,
        }
      : {
          id: updated._id || updated.id,
          type: 'takeaway',
          orderId: updated.orderId,
          customer: updated.customerName,
          time: new Date(updated.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          items: updated.items?.length ? `${updated.items.length} item${updated.items.length > 1 ? 's' : ''}` : 'No items',
          status: updated.status,
        };

    setActivityData(prev => prev.map(i => i.id === newCard.id ? newCard : i));

    if (isRes && setTables) {
      const tableNo = parseInt(updated.tableNumber);
      setTables(prev => prev.map(t => t.no === tableNo ? { ...t, status: 'reserved' } : t));
    }

    setToastMsg(isRes ? 'Reservation updated!' : 'Takeaway updated!');
    setToastType('success');
    setShowToast(true);
    closeEdit();
  };

  const fmt = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const dh = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return `${dh}:${m || '00'} ${ampm}`;
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const endpoint = itemToDelete.type === 'reservation'
        ? `${API_URL}/reservations/${itemToDelete.id}`
        : `${API_URL}/takeaways/${itemToDelete.id}`;

      const r = await fetch(endpoint, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      const res = await r.json();

      if (r.ok && res.success) {
        setActivityData(prev => prev.filter(i => i.id !== itemToDelete.id));
        if (itemToDelete.type === 'reservation' && setTables) {
          const tableNo = parseInt(itemToDelete.table.split('#')[1]);
          setTables(prev => prev.map(t => t.no === tableNo ? { ...t, status: 'available' } : t));
        }
        setToastMsg(`${itemToDelete.type === 'reservation' ? 'Reservation' : 'Takeaway'} deleted!`);
        setToastType('success');
      } else {
        setToastMsg(res.message || 'Failed to delete.');
        setToastType('error');
      }
    } catch (e) {
      setToastMsg('Network error.');
      setToastType('error');
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="w-96 bg-white shadow-xl flex flex-col">
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Reservation', 'Dine', 'Takeaway'].map(tab => {
              const count = activityData.filter(i => tab === 'All' || i.type === tab.toLowerCase()).length;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === tab ? 'bg-[#3673B4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Wed, 12 Nov 2025</span>
            <Calendar className="w-4 h-4 text-[#3673B4]" />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search orders, customers..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4]" />
          </div>

          <div className="space-y-2.5">
            {filteredData.map(item => (
              <div key={item.id}
                className={`rounded-lg p-3 shadow-sm border-l-4 flex items-center justify-between text-xs cursor-pointer transition hover:shadow-md relative
                  ${item.type === 'dine' ? 'bg-[#FF6366]/5 border-[#FF6366]' : ''}
                  ${item.type === 'reservation' ? 'bg-[#1ABB83]/5 border-[#1ABB83]' : ''}
                  ${item.type === 'takeaway' ? 'bg-[#9C27B0]/5 border-[#9C27B0]' : ''}`}>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {item.type === 'dine' && item.table}
                    {item.type === 'reservation' && item.name}
                    {item.type === 'takeaway' && (
                      <span className="flex items-center gap-2">
                        <PackageIcon className="w-4 h-4" />
                        {item.orderId}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {item.type === 'takeaway' ? (
                      <>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.time}</span>
                        <span className="block mt-0.5 truncate">{item.items}</span>
                        <span className="text-gray-400">— {item.customer}</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                        {item.people && (
                          <>
                            <span className="mx-1">•</span>
                            <Users className="w-3.5 h-3.5" />
                            {item.people} people
                          </>
                        )}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white
                    ${item.type === 'dine' ? 'bg-[#FF6366]' : ''}
                    ${item.type === 'reservation' ? 'bg-[#1ABB83]' : ''}
                    ${item.type === 'takeaway' ? 'bg-[#9C27B0]' : ''}`}>
                    {item.type === 'dine' ? 'Dine' : item.type === 'reservation' ? 'Res' : 'Takeaway'}
                  </span>

                  {(item.type === 'reservation' || item.type === 'takeaway') && (
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === item.id ? null : item.id); }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>

                      {activeMenu === item.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                            <button onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setItemToDelete(item); setShowDeleteConfirm(true); setActiveMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t">
          <button className={`w-full ${buttonColor} text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition`}
            onClick={() => isTakeawayActive ? setShowTakeawayForm(true) : setShowReservationForm(true)}>
            <Plus className="w-5 h-5" /> {buttonText}
          </button>
        </div>
      </div>

      {editingItem && (
        <UnifiedEditForm
          item={editingItem}
          onClose={closeEdit}
          onUpdate={afterUpdate}
          tables={tables}
          selectedFloor={selectedFloor}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete {itemToDelete?.type === 'reservation' ? 'Reservation' : 'Takeaway'}?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setItemToDelete(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <ToastNotification message={toastMsg} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </>
  );
};

export default OrderSidebar;