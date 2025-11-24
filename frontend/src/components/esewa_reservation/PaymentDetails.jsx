import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentData = location.state || {};

  useEffect(() => {
    if (!paymentData.amount) {
      const params = new URLSearchParams(location.search);
      const data = {
        amount: params.get('amount'),
        transactionId: params.get('transaction_uuid'),
        productId: params.get('product_code'),
        status: params.get('status') || 'Success',
      };

      if (data.amount) {
        Object.assign(paymentData, data);
      }
    }
  }, [location.search]); 

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful</h1>
          <p className="text-gray-600 mt-2">
            Your payment has been processed successfully
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Details
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">Rs. {paymentData.amount || 'N/A'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium text-sm">
                {paymentData.transactionId || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Product Code:</span>
              <span className="font-medium">{paymentData.productId || 'N/A'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">
                {paymentData.status || 'Success'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">eSewa</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Timer message removed */}

        <button
          onClick={handleGoHome}
          className="w-full py-3 bg-[#3673B4] text-white font-medium rounded-lg transition-colors"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;