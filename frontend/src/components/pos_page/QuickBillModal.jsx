import React from 'react';
import { X, Printer, Wallet, CreditCard, DollarSign, Building } from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';

const QuickBillModal = ({
  showQuickBill,
  setShowQuickBill,
  combinedTotal,
  dineInOrderItems,
  takeawayOrderItems,
  paymentMethod,
  setPaymentMethod,
  handlePay,
  clearOrder
}) => {
  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: Wallet },
    { id: 'khalti', name: 'Khalti', icon: Wallet },
    { id: 'cash', name: 'Cash', icon: DollarSign },
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: Building }
  ];

  if (!showQuickBill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Quick Bill</h2>
          <button onClick={() => setShowQuickBill(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl text-center mb-5">
          <p className="text-3xl font-bold" style={{ color: PRIMARY_BLUE }}>Rs {combinedTotal.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Total Amount</p>
        </div>

        <div className="space-y-4 mb-5 text-sm">
          {dineInOrderItems.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Dine-in</h4>
              {dineInOrderItems.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span>{i.name} × {i.quantity}</span>
                  <span>Rs. {(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          {takeawayOrderItems.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Takeaway</h4>
              {takeawayOrderItems.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span>{i.name} × {i.quantity}</span>
                  <span>Rs. {(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 text-xs transition-all ${paymentMethod === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
              >
                <m.icon className="w-5 h-5" style={{ color: paymentMethod === m.id ? PRIMARY_BLUE : '#6B7280' }} />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={handlePay}
            style={{ backgroundColor: PRIMARY_BLUE }}
            className="flex-1 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" /> Pay
          </button>
          <button
            onClick={() => { clearOrder(); setShowQuickBill(false); }}
            className="flex-1 py-3 rounded-lg bg-red-500 text-white font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBillModal;