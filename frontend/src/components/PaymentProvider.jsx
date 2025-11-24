// src/components/PaymentProvider.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableManagement from './TableManagement';
import RestaurantPOS from './RestaurantPOS';
import EsewaPayment from './esewa_reservation/EsewaPayment';
import SuccessPage from './esewa_reservation/SuccessPage';
import FailurePage from './esewa_reservation/FailurePage';
import PaymentDetails from './esewa_reservation/PaymentDetails';
import QuickEsewa from './esewa_quickbill/QuickEsewa';
import QuickFailure from './esewa_quickbill/QuickFailure';
import QuickSuccess from './esewa_quickbill/QuickSuccess';
import QuickBill from './esewa_quickbill/QuickBill';

export const PaymentContext = React.createContext();

const PaymentProvider = () => {
  // Shared state for reservation & takeaway
  const [paymentData, setPaymentData] = useState({
    amount: '',
    transactionId: '',
    productId: '',
    status: 'Success',
  });

  const [formData, setFormData] = useState(null);
  const [formType, setFormType] = useState(''); // 'reservation' or 'takeaway'

  const updatePaymentData = (data) => setPaymentData(prev => ({ ...prev, ...data }));
  const updateFormData = (data, type) => {
    setFormData(data);
    setFormType(type);
  };

  const clearPaymentData = () => {
    setPaymentData({ amount: '', transactionId: '', productId: '', status: 'Success' });
    setFormData(null);
    setFormType('');
  };

  return (
    <PaymentContext.Provider value={{
      paymentData,
      formData,
      formType,
      updatePaymentData,
      updateFormData,
      clearPaymentData
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<TableManagement />} />
          <Route path="/pos" element={<RestaurantPOS />} />
          <Route path="/esewa" element={<EsewaPayment />} />
          <Route path="/payment/success" element={<SuccessPage />} />
          <Route path="/payment/failed" element={<FailurePage />} />
          <Route path="/payment/details" element={<PaymentDetails />} />
          <Route path="/quickesewa" element={<QuickEsewa />} />
          <Route path="/quickfailure" element={<QuickFailure />} />
          <Route path="/quicksucess" element={<QuickSuccess />} />
          <Route path="/quickbill" element={<QuickBill />} />
        </Routes>
      </Router>
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;