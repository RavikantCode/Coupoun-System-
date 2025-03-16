"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const react_hot_toast_1 = require("react-hot-toast");
const Login_1 = __importDefault(require("./pages/Login"));
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const CouponList_1 = __importDefault(require("./components/CouponList"));
const CreateCoupon_1 = __importDefault(require("./components/CreateCoupon"));
const EditCoupon_1 = __importDefault(require("./components/EditCoupon"));
const CouponHistory_1 = __importDefault(require("./components/CouponHistory"));
const ClaimHistory_1 = __importDefault(require("./pages/ClaimHistory"));
const ClaimCoupon_1 = __importDefault(require("./pages/ClaimCoupon"));
const IpInfo_1 = __importDefault(require("./pages/IpInfo"));
require("./App.css");
const App = () => {
    return (<react_router_dom_1.BrowserRouter>
      <react_hot_toast_1.Toaster position="top-right"/>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
        
        {/* Dashboard routes */}
        <react_router_dom_1.Route path="/dashboard" element={<Dashboard_1.default />}/>
        
        {/* Admin routes */}
        <react_router_dom_1.Route path="/admin" element={<Dashboard_1.default />}>
          <react_router_dom_1.Route index element={<react_router_dom_1.Navigate to="coupons" replace/>}/>
          <react_router_dom_1.Route path="coupons" element={<CouponList_1.default />}/>
          <react_router_dom_1.Route path="coupons/create" element={<CreateCoupon_1.default />}/>
          <react_router_dom_1.Route path="coupons/edit/:id" element={<EditCoupon_1.default />}/>
          <react_router_dom_1.Route path="coupons/history/:id" element={<CouponHistory_1.default />}/>
        </react_router_dom_1.Route>
        
        {/* Claim history as a separate route */}
        <react_router_dom_1.Route path="/claim-history/:id" element={<ClaimHistory_1.default />}/>
        
        {/* IP Info page */}
        <react_router_dom_1.Route path="/ip-info" element={<IpInfo_1.default />}/>
        
        {/* Root route for guest users to claim coupons */}
        <react_router_dom_1.Route path="/" element={<ClaimCoupon_1.default />}/>
        
        {/* Catch all route */}
        <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
};
exports.default = App;
