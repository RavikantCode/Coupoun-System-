"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const axios_1 = __importDefault(require("axios"));
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const fa_1 = require("react-icons/fa");
// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token)
        return null;
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };
};
const Dashboard = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [userRole, setUserRole] = (0, react_1.useState)('');
    const [coupons, setCoupons] = (0, react_1.useState)([]);
    const [allClaims, setAllClaims] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [claimsLoading, setClaimsLoading] = (0, react_1.useState)(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = (0, react_1.useState)(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = (0, react_1.useState)(false);
    const [showAllClaims, setShowAllClaims] = (0, react_1.useState)(false);
    const [selectedCoupon, setSelectedCoupon] = (0, react_1.useState)(null);
    const [newCoupon, setNewCoupon] = (0, react_1.useState)({
        code: '',
        is_Available: true,
        is_Active: true
    });
    const [deletingCoupon, setDeletingCoupon] = (0, react_1.useState)(null);
    // This effect will run whenever the location changes (including when navigating back)
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        if (!token) {
            navigate('/login');
            return;
        }
        setUserRole(role || '');
        fetchCoupons();
        fetchAllClaims();
        // Add event listener to handle when the page becomes visible again
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchCoupons();
                fetchAllClaims();
            }
        };
        // Add event listener for page visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        // Add event listener for when the user navigates back to this page
        window.addEventListener('popstate', fetchCoupons);
        // Cleanup event listeners on component unmount
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('popstate', fetchCoupons);
        };
    }, [navigate, location]);
    const fetchCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                navigate('/login');
                return;
            }
            console.log('Fetching coupons with token:', token.substring(0, 10) + '...');
            const authConfig = getAuthHeaders();
            if (!authConfig) {
                react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                navigate('/login');
                return;
            }
            // Use the endpoint that returns all coupons, including claimed ones
            const response = yield axios_1.default.get('http://localhost:5000/api/v1/admin/coupons?includeAll=true', authConfig);
            console.log('Coupons response:', response.data);
            // Check if the response has the expected structure
            if (response.data && response.data.coupons && Array.isArray(response.data.coupons)) {
                setCoupons(response.data.coupons);
            }
            else if (response.data && Array.isArray(response.data)) {
                setCoupons(response.data);
            }
            else {
                react_hot_toast_1.default.error('Unexpected response format');
            }
        }
        catch (error) {
            console.error('Fetch error details:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            react_hot_toast_1.default.error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) || 'Failed to fetch coupons');
        }
        finally {
            setLoading(false);
        }
    });
    const fetchAllClaims = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            setClaimsLoading(true);
            const authConfig = getAuthHeaders();
            if (!authConfig) {
                react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                navigate('/login');
                return;
            }
            const response = yield axios_1.default.get('http://localhost:5000/api/v1/admin/claim-history', authConfig);
            if (response.data && response.data.claims) {
                setAllClaims(response.data.claims);
            }
            else {
                react_hot_toast_1.default.error('Failed to fetch claim history');
            }
        }
        catch (error) {
            console.error('Error fetching all claims:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            react_hot_toast_1.default.error('Failed to fetch claim history');
        }
        finally {
            setClaimsLoading(false);
        }
    });
    const handleCreateCoupon = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        e.preventDefault();
        try {
            const authConfig = getAuthHeaders();
            if (!authConfig) {
                react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                navigate('/login');
                return;
            }
            console.log('Creating coupon:', newCoupon);
            const response = yield axios_1.default.post('http://localhost:5000/api/v1/admin/create-coupon', newCoupon, authConfig);
            console.log('Create response:', response.data);
            react_hot_toast_1.default.success('Coupon created successfully');
            setIsCreateModalOpen(false);
            setNewCoupon({ code: '', is_Available: true, is_Active: true });
            fetchCoupons();
        }
        catch (error) {
            console.error('Create error details:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            react_hot_toast_1.default.error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) || 'Failed to create coupon');
        }
    });
    const toggleCouponStatus = (couponCode, field) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const authConfig = getAuthHeaders();
            if (!authConfig) {
                react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                navigate('/login');
                return;
            }
            console.log(`Toggling ${field} for coupon:`, couponCode);
            // Use the correct endpoint based on the backend route
            const response = yield axios_1.default.post('http://localhost:5000/api/v1/admin/toggle-coupon', { code: couponCode }, // Send the coupon code
            authConfig);
            console.log('Toggle response:', response.data);
            react_hot_toast_1.default.success('Status updated successfully');
            fetchCoupons();
        }
        catch (error) {
            console.error('Toggle error details:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            react_hot_toast_1.default.error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) || 'Failed to update status');
        }
    });
    const handleDeleteCoupon = (couponCode) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (window.confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) {
            try {
                setDeletingCoupon(couponCode);
                const authConfig = getAuthHeaders();
                if (!authConfig) {
                    react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                    navigate('/login');
                    return;
                }
                console.log('Deleting coupon with code:', couponCode);
                const response = yield axios_1.default.post('http://localhost:5000/api/v1/admin/delete-coupon', { code: couponCode }, authConfig);
                console.log('Delete response:', response.data);
                react_hot_toast_1.default.success('Coupon deleted successfully');
                fetchCoupons();
            }
            catch (error) {
                console.error('Delete error details:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                react_hot_toast_1.default.error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) || 'Failed to delete coupon');
            }
            finally {
                setDeletingCoupon(null);
            }
        }
    });
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };
    const viewClaimHistory = (coupon) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // If the coupon already has detailed claim history, just show the modal
            if (coupon.claim_history && coupon.claim_history.length > 0) {
                setSelectedCoupon(coupon);
                setIsHistoryModalOpen(true);
                return;
            }
            // Otherwise, fetch detailed claim history
            const authConfig = getAuthHeaders();
            if (!authConfig) {
                react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                navigate('/login');
                return;
            }
            // Show loading state
            const toastId = react_hot_toast_1.default.loading('Fetching claim history...');
            // First try to get claim history from the coupon endpoint
            try {
                const response = yield axios_1.default.get(`http://localhost:5000/api/v1/admin/edit-coupon/${coupon._id}`, authConfig);
                react_hot_toast_1.default.dismiss(toastId);
                if (response.data && response.data.coupon) {
                    // If the coupon has claim history in the response, use it
                    setSelectedCoupon(response.data.coupon);
                    setIsHistoryModalOpen(true);
                }
                else {
                    // If not, try the claim-history endpoint to get more details
                    const claimResponse = yield axios_1.default.get(`http://localhost:5000/api/v1/admin/claim-history`, authConfig);
                    if (claimResponse.data && claimResponse.data.claims) {
                        // Filter claims for this coupon
                        const couponClaims = claimResponse.data.claims.filter((claim) => claim.coupon_code === coupon.code);
                        // Create a new coupon object with the claim history
                        const couponWithHistory = Object.assign(Object.assign({}, coupon), { claim_history: couponClaims.map((claim) => ({
                                user_id: 'Anonymous', // User ID is not tracked in our system
                                claimed_at: claim.claimed_at,
                                ip_address: claim.ip_address || 'N/A',
                                public_ip: claim.public_ip || 'N/A',
                                cookie_id: claim.cookie_id || 'N/A'
                            })) });
                        setSelectedCoupon(couponWithHistory);
                        setIsHistoryModalOpen(true);
                    }
                    else {
                        react_hot_toast_1.default.error('No claim history found for this coupon');
                    }
                }
            }
            catch (error) {
                react_hot_toast_1.default.dismiss(toastId);
                console.error('Error fetching claim history:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                react_hot_toast_1.default.error('Failed to fetch claim history');
            }
        }
        catch (error) {
            react_hot_toast_1.default.dismiss();
            console.error('Error fetching claim history:', ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
            react_hot_toast_1.default.error('Failed to fetch claim history');
        }
    });
    return (<div className="min-h-screen bg-gray-900 text-white" key={location.key || 'dashboard'}>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                {userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
              </h1>
            </div>
            <div className="flex items-center">
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600">
                <fa_1.FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {userRole === 'admin' ? (<div className="space-y-6">
            {/* Header with Create Button and View Claims Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
              <div className="flex gap-3">
                <button onClick={() => setShowAllClaims(!showAllClaims)} className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md">
                  <fa_1.FaListAlt /> {showAllClaims ? 'Hide Claims' : 'View All Claims'}
                </button>
                <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md">
                  <fa_1.FaPlus /> Create Coupon
                </button>
              </div>
            </div>

            {/* All Claims Section */}
            {showAllClaims && (<div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                <div className="px-6 py-4 bg-gray-900">
                  <h3 className="text-lg font-medium text-white">All Claimed Coupons</h3>
                </div>
                <div className="overflow-x-auto">
                  {claimsLoading ? (<div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>) : allClaims.length > 0 ? (<table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coupon Code</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Local IP</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Public IP</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cookie ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claimed At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {allClaims.map((claim, index) => (<tr key={index} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                              {claim.coupon_code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {claim.ip_address || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {claim.public_ip || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {claim.cookie_id || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(claim.claimed_at).toLocaleString()}
                            </td>
                          </tr>))}
                      </tbody>
                    </table>) : (<div className="text-center py-8 text-gray-400">
                      No claims found.
                    </div>)}
                </div>
              </div>)}

            {/* Coupon Table */}
            <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Availability</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claimed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {coupons.map((coupon) => {
                var _a;
                return (<tr key={coupon._id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{coupon.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => toggleCouponStatus(coupon.code, 'is_Active')} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${coupon.is_Active !== false && !coupon.isClaimed
                        ? 'text-green-200 bg-green-900 hover:bg-green-800'
                        : 'text-red-200 bg-red-900 hover:bg-red-800'}`}>
                            {coupon.is_Active !== false && !coupon.isClaimed ? <fa_1.FaToggleOn /> : <fa_1.FaToggleOff />}
                            {coupon.is_Active !== false && !coupon.isClaimed ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => toggleCouponStatus(coupon.code, 'is_Available')} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${coupon.is_Available
                        ? 'text-green-200 bg-green-900 hover:bg-green-800'
                        : 'text-red-200 bg-red-900 hover:bg-red-800'}`}>
                            {coupon.is_Available ? <fa_1.FaToggleOn /> : <fa_1.FaToggleOff />}
                            {coupon.is_Available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${coupon.isClaimed
                        ? 'text-purple-200 bg-purple-900'
                        : 'text-gray-200 bg-gray-700'}`}>
                            {coupon.isClaimed ? 'Claimed' : 'Not Claimed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => {
                        viewClaimHistory(coupon);
                    }} className="text-blue-400 hover:text-blue-300 mr-3">
                            <fa_1.FaHistory className="inline-block mr-1"/> View History ({((_a = coupon.claim_history) === null || _a === void 0 ? void 0 : _a.length) || 0})
                          </button>
                          <button onClick={() => handleDeleteCoupon(coupon.code)} disabled={deletingCoupon === coupon.code} className="text-red-400 hover:text-red-300">
                            <fa_1.FaTrash className="inline-block mr-1"/> {deletingCoupon === coupon.code ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>);
            })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>) : (<div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">User Dashboard</h2>
            <p className="text-gray-300">Welcome to your dashboard! Here you can manage your account and view your coupon history.</p>
          </div>)}
      </main>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-white">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Code</label>
                <input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon(Object.assign(Object.assign({}, newCoupon), { code: e.target.value }))} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500" required/>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={newCoupon.is_Available} onChange={(e) => setNewCoupon(Object.assign(Object.assign({}, newCoupon), { is_Available: e.target.checked }))} className="rounded bg-gray-800 border-gray-700 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                  <span className="ml-2 text-sm text-gray-300">Available</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={newCoupon.is_Active} onChange={(e) => setNewCoupon(Object.assign(Object.assign({}, newCoupon), { is_Active: e.target.checked }))} className="rounded bg-gray-800 border-gray-700 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                  <span className="ml-2 text-sm text-gray-300">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Claim History Modal */}
      {isHistoryModalOpen && selectedCoupon && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Claim Details for Coupon: <span className="text-blue-400">{selectedCoupon.code}</span>
              </h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-gray-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            {selectedCoupon.claim_history && selectedCoupon.claim_history.length > 0 ? (<div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Local IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Public IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cookie ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claimed At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {selectedCoupon.claim_history.map((claim, index) => (<tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {claim.ip_address || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {claim.public_ip || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {claim.cookie_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(claim.claimed_at).toLocaleString()}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>) : (<div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
                No claim information available for this coupon.
              </div>)}
            
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsHistoryModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 border border-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
exports.default = Dashboard;
