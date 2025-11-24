// src/pages/QuickBill.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, X, CheckCircle } from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';

const QuickBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const stateData = location.state || JSON.parse(localStorage.getItem('quickBillData') || '{}');

  const {
    orderId = 'PR3004',
    dineInOrderItems = [],
    takeawayOrderItems = [],
    dineInDiscount = 0,
    takeawayDiscount = 0,
  } = stateData;

  const combinedSubtotal =
    dineInOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    takeawayOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const combinedDiscount = dineInDiscount + takeawayDiscount;
  const combinedTax = combinedSubtotal * 0.13;
  const combinedTotal = combinedSubtotal + combinedTax - combinedDiscount;

  // Save to database when component mounts
  useEffect(() => {
    const saveToDatabase = async () => {
      if (dineInOrderItems.length === 0 && takeawayOrderItems.length === 0) {
        return; // Don't save if no items
      }

      setIsSaving(true);
      setSaveError(null);

      try {
        const response = await fetch('http://localhost:5000/api/quickbill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            dineInOrderItems,
            takeawayOrderItems,
            dineInDiscount,
            takeawayDiscount,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setSaveSuccess(true);
          // Auto-hide success message after 3 seconds
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setSaveError(data.message || 'Failed to save bill');
        }
      } catch (error) {
        console.error('Error saving to database:', error);
        setSaveError('Unable to connect to server');
      } finally {
        setIsSaving(false);
      }
    };

    saveToDatabase();
  }, []); // Run once on mount

  const handlePrint = () => {
    window.print();
  };

  const handleBackToPOS = () => {
    localStorage.removeItem('quickBillData');
    navigate('/pos');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quick Bill</h2>
          <button
            onClick={handleBackToPOS}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Save Status Messages */}
        {isSaving && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
            Saving to database...
          </div>
        )}
        
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Bill saved successfully!
          </div>
        )}
        
        {saveError && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-800">
            {saveError}
          </div>
        )}

        {/* Total Amount Box */}
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl md:text-3xl font-bold" style={{ color: PRIMARY_BLUE }}>
            Rs {combinedTotal.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Amount</p>
        </div>

        {/* Dine-in Items */}
        {dineInOrderItems.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dine-in Orders</h4>
            <div className="space-y-2">
              {dineInOrderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex-1">
                    {item.name} × {item.quantity}
                    {item.note && <span className="text-gray-500 text-xs"> ({item.note})</span>}
                  </span>
                  <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Takeaway Items */}
        {takeawayOrderItems.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Takeaway Orders</h4>
            <div className="space-y-2">
              {takeawayOrderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex-1">
                    {item.name} × {item.quantity}
                    {item.note && <span className="text-gray-500 text-xs"> ({item.note})</span>}
                  </span>
                  <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">Rs {combinedSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (13%):</span>
            <span className="font-medium">Rs {combinedTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium">Rs {combinedDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span style={{ color: PRIMARY_BLUE }}>Rs {combinedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handlePrint}
            style={{ backgroundColor: PRIMARY_BLUE }}
            className="flex-1 py-3 rounded-lg text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Bill
          </button>

          <button
            onClick={handleBackToPOS}
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to POS
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBill;