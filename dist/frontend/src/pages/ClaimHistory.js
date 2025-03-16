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
const ClaimHistory = () => {
    const { id } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [coupon, setCoupon] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchCouponHistory = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                const authConfig = getAuthHeaders();
                if (!authConfig) {
                    react_hot_toast_1.default.error('Authentication token missing. Please log in again.');
                    navigate('/login');
                    return;
                }
                const response = yield axios_1.default.get(`http://localhost:5000/api/v1/admin/edit-coupon/${id}`, authConfig);
                console.log('Coupon history response:', response.data);
                if (response.data && response.data.coupon) {
                    setCoupon(response.data.coupon);
                }
                else {
                    react_hot_toast_1.default.error('Invalid response format');
                }
            }
            catch (error) {
                console.error('Error fetching coupon history:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                react_hot_toast_1.default.error('Failed to fetch coupon history');
                navigate('/dashboard');
            }
            finally {
                setLoading(false);
            }
        });
        fetchCouponHistory();
    }, [id, navigate]);
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Handle back navigation with state preservation
    const handleBackNavigation = () => {
        // Navigate back to dashboard with replace to avoid adding to history stack
        navigate('/dashboard', { replace: true, state: { forceRefresh: Date.now() } });
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>);
    }
    if (!coupon) {
        return null;
    }
    return (<div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBackNavigation} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <fa_1.FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Claim History for {coupon.code}
            </h1>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Coupon Details
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Code</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {coupon.code}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {coupon.name}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className={`px-2 py-1 text-sm rounded-full ${coupon.is_Active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'}`}>
                      {coupon.is_Active ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Claims</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {coupon.claim_history.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Claim History</h3>
            {coupon.claim_history && coupon.claim_history.length > 0 ? (<div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Claimed At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupon.claim_history.map((claim, index) => (<tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {claim.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(claim.claimed_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {claim.ip_address || 'N/A'}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>) : (<div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
                No claims yet
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = ClaimHistory;
