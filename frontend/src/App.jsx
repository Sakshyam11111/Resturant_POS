import { Routes, Route } from 'react-router-dom';
import TableManagement from './components/TableManagement';
import RestaurantPOS from './components/RestaurantPOS';
import QuickEsewa from './components/esewa_quickbill/QuickEsewa';
import QuickFailure from './components/esewa_quickbill/QuickFailure';
import QuickSuccess from './components/esewa_quickbill/QuickSuccess';
import QuickBill from './components/esewa_quickbill/QuickBill';

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<TableManagement />} />
        <Route path="/pos" element={<RestaurantPOS />} />
        <Route path="/quickesewa" element={<QuickEsewa />} />
        <Route path="/quickfailure" element={<QuickFailure />} />
        <Route path="/quicksucess" element={<QuickSuccess />} />
        <Route path="/quickbill" element={<QuickBill />} />
      </Routes>
   
  );
}

export default App;