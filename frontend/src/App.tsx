import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CouponList from './components/CouponList';
import CreateCoupon from './components/CreateCoupon';
import EditCoupon from './components/EditCoupon';
import CouponHistory from './components/CouponHistory';
import ClaimHistory from './pages/ClaimHistory';
import ClaimCoupon from './pages/ClaimCoupon';
import IpInfo from './pages/IpInfo';
import AllClaims from './pages/AllClaims';
import './App.css'

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<Navigate to="coupons" replace />} />
          <Route path="coupons" element={<CouponList />} />
          <Route path="coupons/create" element={<CreateCoupon />} />
          <Route path="coupons/edit/:id" element={<EditCoupon />} />
          <Route path="coupons/history/:id" element={<CouponHistory />} />
        </Route>
                <Route path="/claim-history/:id" element={<ClaimHistory />} />
        
        <Route path="/ip-info" element={<IpInfo />} />
        
        <Route path="/" element={<ClaimCoupon />} />
                <Route path="/all-claims" element={<AllClaims />} />
                <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
