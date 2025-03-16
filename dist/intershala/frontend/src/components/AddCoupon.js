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
const AddCoupon = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [code, setCode] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        if (!code.trim()) {
            react_hot_toast_1.default.error('Please enter a coupon code');
            return;
        }
        setLoading(true);
        try {
            yield axios_1.default.post('http://localhost:5000/api/v1/admin/create-coupon', { code: code.toUpperCase() }, { withCredentials: true });
            react_hot_toast_1.default.success('Coupon created successfully');
            navigate('/admin/coupons');
        }
        catch (error) {
            react_hot_toast_1.default.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to create coupon');
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Coupon Code
          </label>
          <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter coupon code" required/>
          <p className="mt-1 text-sm text-gray-500">
            Code will be automatically converted to uppercase
          </p>
        </div>
        <button type="submit" disabled={loading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>
    </div>);
};
exports.default = AddCoupon;
