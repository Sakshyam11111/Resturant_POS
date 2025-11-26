// src/components/esewa_quickbill/QuickSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Read full bill from localStorage
    const billData = JSON.parse(localStorage.getItem('quickBillData') || '{}');

    const timer = setTimeout(() => {
      navigate('/quickbill', { state: billData });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600">Your bill is being generated…</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting to Quick Bill…</p>
      </div>
    </div>
  );
};

export default QuickSuccess;