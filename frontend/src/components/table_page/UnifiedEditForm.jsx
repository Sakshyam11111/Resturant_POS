// src/components/UnifiedEditForm.jsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Toast = ({ msg, onClose }) => (
  <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-lg shadow-xl p-4 flex items-center space-x-3 border border-gray-100">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{msg}</p>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const UnifiedEditForm = ({ item, onClose, onUpdate, tables, selectedFloor }) => {
  const isReservation = item.type === 'reservation';

  // Extract time from `item.time` (e.g., "10:00 AM – 11:00 AM")
  const parseTimeRange = (timeStr) => {
    if (!timeStr || !timeStr.includes('–')) return { from: '', to: '' };
    const [from, to] = timeStr.split('–').map(t => t.trim());
    return { from: to24Hour(from), to: to24Hour(to) };
  };

  const to24Hour = (time12h) => {
    if (!time12h) return '';
    const [time, period] = time12h.split(' ');
    let [h, m] = time.split(':');
    h = parseInt(h);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m || '00'}`;
  };

  const { from, to } = isReservation ? parseTimeRange(item.time) : { from: '', to: '' };

  // Initial form: Use `item` prop for visible data
  const [form, setForm] = useState({
    customerName: item.name || item.customer || '',
    phoneNumber: '',
    email: '',
    companyName: '',
    date: '',
    fromTime: from,
    toTime: to,
    guests: item.people || '',
    tableNumber: isReservation ? item.table?.replace('Table #', '') || '' : '',
    floor: selectedFloor === 'First Floor' ? 'first' : 'second',
    advanceAmount: '0',
    paymentMode: '',
    refer: '',
    note: '',
    alternativeNumber: '',
    location: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState(true); // Show loading state
  const [toast, setToast] = useState('');

  // Fetch full data from API
  useEffect(() => {
    const loadFullData = async () => {
      if (!item.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const endpoint = isReservation
          ? `${API_URL}/reservations/${item.id}`
          : `${API_URL}/takeaways/${item.id}`;

        console.log('Fetching full data from:', endpoint); // DEBUG

        const response = await fetch(endpoint);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load data');
        }

        // Handle different response shapes
        const data = result.data || result;

        console.log('Full data loaded:', data); // DEBUG

        setForm(prev => ({
          ...prev,
          customerName: data.customerName || prev.customerName,
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          companyName: data.companyName || '',
          date: data.date ? data.date.split('T')[0] : prev.date,
          fromTime: data.fromTime || prev.fromTime,
          toTime: data.toTime || prev.toTime,
          guests: data.guests || prev.guests,
          tableNumber: data.tableNumber || prev.tableNumber,
          advanceAmount: data.advanceAmount?.toString() || '0',
          paymentMode: data.paymentMode || '',
          refer: data.refer || '',
          note: data.note || '',
          alternativeNumber: data.alternativeNumber || '',
          location: data.location || '',
          remarks: data.remarks || '',
        }));
      } catch (err) {
        console.error('API Error:', err);
        setApiErr(`Failed to load full data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadFullData();
  }, [item.id, isReservation, item.time, item.people, item.table]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (apiErr) setApiErr('');
  };

  const validate = () => {
    const err = {};
    if (!form.customerName.trim()) err.customerName = 'Required';
    if (!form.phoneNumber.trim()) err.phoneNumber = 'Required';
    else if (!/^\+?\d{10,15}$/.test(form.phoneNumber.replace(/\s/g, '')))
      err.phoneNumber = 'Invalid phone';

    if (isReservation) {
      if (!form.date) err.date = 'Required';
      if (!form.fromTime) err.fromTime = 'Required';
      if (!form.toTime) err.toTime = 'Required';
      if (form.fromTime >= form.toTime) err.toTime = 'Must be after start';
      if (!form.guests || form.guests < 1) err.guests = 'Required';
      if (!form.tableNumber) err.tableNumber = 'Required';
    } else {
      if (!form.location.trim()) err.location = 'Required';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const endpoint = isReservation
        ? `${API_URL}/reservations/${item.id}`
        : `${API_URL}/takeaways/${item.id}`;

      const payload = {
        customerName: form.customerName,
        phoneNumber: form.phoneNumber,
        ...(isReservation && {
          email: form.email,
          companyName: form.companyName,
          date: form.date,
          fromTime: form.fromTime,
          toTime: form.toTime,
          guests: parseInt(form.guests),
          tableNumber: form.tableNumber,
          floor: form.floor,
          advanceAmount: parseFloat(form.advanceAmount) || 0,
          paymentMode: form.paymentMode,
          refer: form.refer,
          note: form.note,
        }),
        ...(!isReservation && {
          alternativeNumber: form.alternativeNumber,
          location: form.location,
          remarks: form.remarks,
        }),
      };

      const r = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await r.json();
      if (!r.ok) throw new Error(res.message || 'Update failed');

      onUpdate(res.data || res);
      setToast(isReservation ? 'Reservation updated!' : 'Takeaway updated!');
      setTimeout(() => onClose(), 1500);
    } catch (e) {
      setApiErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const fmt = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const dh = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return `${dh}:${m || '00'} ${ampm}`;
  };

  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-600 mt-3">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Edit {isReservation ? 'Reservation' : 'Takeaway'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {apiErr && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{apiErr}</p>
            </div>
          )}

          <div className="p-6 space-y-5">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+977 98xxxxxxxx"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Reservation Fields */}
            {isReservation && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests *</label>
                    <input
                      type="number"
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.guests ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Time *</label>
                    <select
                      name="fromTime"
                      value={form.fromTime}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.fromTime ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{fmt(t)}</option>
                      ))}
                    </select>
                    {errors.fromTime && <p className="text-red-500 text-xs mt-1">{errors.fromTime}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Time *</label>
                    <select
                      name="toTime"
                      value={form.toTime}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.toTime ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select</option>
                      {timeSlots.filter(t => t > form.fromTime).map(t => (
                        <option key={t} value={t}>{fmt(t)}</option>
                      ))}
                    </select>
                    {errors.toTime && <p className="text-red-500 text-xs mt-1">{errors.toTime}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table *</label>
                  <select
                    name="tableNumber"
                    value={form.tableNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.tableNumber ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select table</option>
                    {tables
                      .filter(t => t.status === 'available' || t.no === Number(form.tableNumber))
                      .map(t => (
                        <option key={t.no} value={t.no}>
                          Table {t.no} ({t.seats} seats)
                        </option>
                      ))}
                  </select>
                  {errors.tableNumber && <p className="text-red-500 text-xs mt-1">{errors.tableNumber}</p>}
                </div>
              </>
            )}

            {/* Takeaway Fields */}
            {!isReservation && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Number</label>
                  <input
                    name="alternativeNumber"
                    value={form.alternativeNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.alternativeNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.alternativeNumber && <p className="text-red-500 text-xs mt-1">{errors.alternativeNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#3673B4]"
                  />
                  <p className="text-xs text-gray-500">{form.remarks.length}/500</p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className={`px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition ${
                saving ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#3673B4] text-white hover:bg-[#2c5d94]'
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </>
  );
};

export default UnifiedEditForm;