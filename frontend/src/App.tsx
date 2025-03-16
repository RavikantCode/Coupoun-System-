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
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<Navigate to="coupons" replace />} />
          <Route path="coupons" element={<CouponList />} />
          <Route path="coupons/create" element={<CreateCoupon />} />
          <Route path="coupons/edit/:id" element={<EditCoupon />} />
          <Route path="coupons/history/:id" element={<CouponHistory />} />
        </Route>
        
        {/* Claim history as a separate route */}
        <Route path="/claim-history/:id" element={<ClaimHistory />} />
        
        {/* IP Info page */}
        <Route path="/ip-info" element={<IpInfo />} />
        
        {/* Root route for guest users to claim coupons */}
        <Route path="/" element={<ClaimCoupon />} />
        
        {/* All claims page */}
        <Route path="/all-claims" element={<AllClaims />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
