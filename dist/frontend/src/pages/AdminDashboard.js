"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const CouponList_1 = __importDefault(require("../components/CouponList"));
const ClaimHistory_1 = __importDefault(require("../components/ClaimHistory"));
const AddCoupon_1 = __importDefault(require("../components/AddCoupon"));
const AdminDashboard = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('coupons');
    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/');
    };
    return (<div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <react_router_dom_1.Link to="/admin/coupons" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'coupons'
            ? 'border-indigo-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('coupons')}>
                  Coupons
                </react_router_dom_1.Link>
                <react_router_dom_1.Link to="/admin/history" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'history'
            ? 'border-indigo-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('history')}>
                  Claim History
                </react_router_dom_1.Link>
                <react_router_dom_1.Link to="/admin/add" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'add'
            ? 'border-indigo-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('add')}>
                  Add Coupon
                </react_router_dom_1.Link>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={handleLogout} className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<CouponList_1.default />}/>
          <react_router_dom_1.Route path="/coupons" element={<CouponList_1.default />}/>
          <react_router_dom_1.Route path="/history" element={<ClaimHistory_1.default />}/>
          <react_router_dom_1.Route path="/add" element={<AddCoupon_1.default />}/>
        </react_router_dom_1.Routes>
      </div>
    </div>);
};
exports.default = AdminDashboard;
