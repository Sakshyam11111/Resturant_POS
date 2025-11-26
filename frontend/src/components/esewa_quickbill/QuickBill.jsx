// src/components/esewa_quickbill/QuickBill.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, X, CheckCircle, AlertCircle } from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';
const API_URL = 'http://localhost:5000/api';

const QuickBill = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const stored = JSON.parse(localStorage.getItem('quickBillData') || '{}');

  const {
    orderId = `QB${Date.now()}`,
    tableId = '',
    table = '',
    tableNumber = '',
    waiterId = '',
    waiterName = '',
    dineInOrderItems = [],
    takeawayOrderItems = [],
    dineInDiscount = 0,
    takeawayDiscount = 0,
    paymentMethod = stateData.paymentMethod || stored.paymentMethod || 'cash',
  } = { ...stored, ...stateData };

  const subtotal =
    dineInOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    takeawayOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = subtotal * 0.13;
  const discount = dineInDiscount + takeawayDiscount;
  const total = subtotal + tax - discount;

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const saveBill = async () => {
      console.log("hello");
      if (dineInOrderItems.length === 0 && takeawayOrderItems.length === 0) {
        setSaveError('No items to save');
        return;
      }

      setIsSaving(true);
      setSaveError(null);

      try {
        const payload = {
          orderId,
          tableId,
          tableNumber: table || tableNumber,
          waiterId,
          waiterName,
          dineInOrderItems,
          takeawayOrderItems,
          dineInDiscount,
          takeawayDiscount,
          paymentMethod,
        };

        const res = await fetch(`${API_URL}/quickbill`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (json.success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setSaveError(json.message || 'Failed to save bill');
        }
      } catch (err) {
        setSaveError('Network error. Please try again.');
      } finally {
        setIsSaving(false);
      }
    };

    saveBill();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    localStorage.removeItem('quickBillData');
    navigate('/pos');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 print:bg-white print:p-0">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 space-y-6 print:shadow-none print:rounded-none print:max-w-full">

        <div className="flex justify-between items-center print:justify-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quick Bill</h2>
            <p className="text-sm text-gray-500 mt-1">Order ID: {orderId}</p>
            {(table || tableNumber) && (
              <p className="text-sm text-gray-500">Table: {table || tableNumber}</p>
            )}
            {waiterName && (
              <p className="text-sm text-gray-500">Waiter: {waiterName}</p>
            )}
          </div>
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 print:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSaving && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800 flex items-center gap-2 print:hidden">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Saving…
          </div>
        )}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-800 flex items-center gap-2 print:hidden">
            <CheckCircle className="w-5 h-5" /> Bill saved successfully!
          </div>
        )}
        {saveError && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-800 flex items-center gap-2 print:hidden">
            <AlertCircle className="w-5 h-5" /> {saveError}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg text-center print:bg-transparent print:p-2">
          <p className="text-2xl md:text-3xl font-bold" style={{ color: PRIMARY_BLUE }}>
            Rs {total.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Amount</p>
        </div>

        {dineInOrderItems.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dine-in</h4>
            {dineInOrderItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span className="flex-1">
                  {item.name} × {item.quantity}
                  {item.note && (
                    <span className="text-gray-500 text-xs block">({item.note})</span>
                  )}
                </span>
                <span className="font-medium">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {takeawayOrderItems.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Takeaway</h4>
            {takeawayOrderItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span className="flex-1">
                  {item.name} × {item.quantity}
                  {item.note && (
                    <span className="text-gray-500 text-xs block">({item.note})</span>
                  )}
                </span>
                <span className="font-medium">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 pt-4 border-t border-gray-200 print:border-gray-300">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (13%):</span>
            <span className="font-medium">Rs {tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-red-600">
                -Rs {discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span style={{ color: PRIMARY_BLUE }}>Rs {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2">
            <span className="text-gray-600">Payment:</span>
            <span className="font-medium capitalize">
              {paymentMethod === 'esewa' ? 'eSewa' : paymentMethod}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 print:hidden">
          <button
            onClick={handlePrint}
            style={{ backgroundColor: PRIMARY_BLUE }}
            className="flex-1 py-3 rounded-lg text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2 transition-opacity"
          >
            <Printer className="w-5 h-5" /> Print
          </button>
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 print:text-xs print:mt-4">
          {new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickBill;