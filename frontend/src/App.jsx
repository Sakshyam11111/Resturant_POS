import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableManagement from './components/table_page/TableManagement';
import RestaurantPOS from './components/pos_page/RestaurantPOS';
import QuickEsewa from './components/esewa_quickbill/QuickEsewa';
import QuickFailure from './components/esewa_quickbill/QuickFailure';
import QuickSuccess from './components/esewa_quickbill/QuickSuccess';
import QuickBill from './components/esewa_quickbill/QuickBill';
import MenuGroup from './components/master/MenuGroup';
import MenuCreate from './components/master/MenuCreate';
import LocationCreate from './components/master/LocationCreate';
import TableCreate from './components/master/TableCreate';
import WaiterCreate from './components/master/WaiterCreate';
import TableSplit from './components/master/TableSplit';
import Landingpage from './components/pages/Landingpage';
import JoinUs from './components/pages/JoinUs';
import CustomerLogin from './components/pages/customerlogin/CustomerLogin';
import CustomerSignup from './components/pages/customerlogin/CustomerSignup';
import StaffLogin from './components/pages/customerlogin/StaffLogin';
import StaffSignup from './components/pages/customerlogin/StaffSignup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/table" element={<TableManagement />} />
        <Route path="/pos" element={<RestaurantPOS />} />
        <Route path="/quickesewa" element={<QuickEsewa />} />
        <Route path="/quickfailure" element={<QuickFailure />} />
        <Route path="/quicksucess" element={<QuickSuccess />} />
        <Route path="/quickbill" element={<QuickBill />} />
        <Route path="/menu_group" element={<MenuGroup />} />
        <Route path="/menu_create" element={<MenuCreate />} />
        <Route path="/location_create" element={<LocationCreate />} />
        <Route path="/table_create" element={<TableCreate />} />
        <Route path="/waiter_create" element={<WaiterCreate />} />
        <Route path="/table_split" element={<TableSplit />} />

        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customersignup" element={<CustomerSignup />} />

        <Route path="/stafflogin" element={<StaffLogin />} />
        <Route path="/staffsignup" element={<StaffSignup />} />
      </Routes>
    </Router>
  );
}

export default App;

