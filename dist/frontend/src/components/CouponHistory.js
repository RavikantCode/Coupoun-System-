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
const CouponHistory = () => {
    const { id } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [coupon, setCoupon] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchCouponHistory = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const token = localStorage.getItem('token');
                const response = yield axios_1.default.get(`http://localhost:5000/api/v1/admin/edit-coupon/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCoupon(response.data.coupon);
            }
            catch (error) {
                react_hot_toast_1.default.error('Failed to fetch coupon history');
                navigate('/admin/coupons');
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
    if (loading) {
        return (<div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>);
    }
    if (!coupon) {
        return null;
    }
    return (<div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/coupons')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <fa_1.FaArrowLeft /> Back to Coupons
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Claim History - {coupon.code}
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Coupon Details</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-900">Code: <span className="font-medium">{coupon.code}</span></p>
              <p className="text-gray-900">Name: <span className="font-medium">{coupon.name}</span></p>
              <p className="text-gray-900">Status: 
                <span className={`ml-2 px-2 py-1 text-sm font-medium rounded-full ${coupon.is_Active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {coupon.is_Active ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p className="text-gray-900">Availability: 
                <span className={`ml-2 px-2 py-1 text-sm font-medium rounded-full ${coupon.is_Available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {coupon.is_Available ? 'Available' : 'Unavailable'}
                </span>
              </p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Statistics</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-900">Total Claims: <span className="font-medium">{coupon.claim_history.length}</span></p>
              {coupon.claim_history.length > 0 && (<>
                  <p className="text-gray-900">Last Claimed: 
                    <span className="font-medium ml-2">
                      {formatDate(coupon.claim_history[coupon.claim_history.length - 1].claimed_at)}
                    </span>
                  </p>
                </>)}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">Claim History</h3>
        {coupon.claim_history.length > 0 ? (<div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimed At</th>
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
                  </tr>))}
              </tbody>
            </table>
          </div>) : (<div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No claims yet</p>
          </div>)}
      </div>
    </div>);
};
exports.default = CouponHistory;
