import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableManagement from './components/TableManagement';
import RestaurantPOS from './components/RestaurantPOS';
import EsewaPayment from './components/esewa_reservation/EsewaPayment';
import SuccessPage from './components/esewa_reservation/SuccessPage';
import FailurePage from './components/esewa_reservation/FailurePage';
import PaymentDetails from './components/esewa_reservation/PaymentDetails';
import QuickEsewa from './components/esewa_quickbill/QuickEsewa';
import QuickFailure from './components/esewa_quickbill/QuickFailure';
import QuickSuccess from './components/esewa_quickbill/QuickSuccess';
import QuickBill from './components/esewa_quickbill/QuickBill';

function App() {
  return (
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
  );
}

export default App;