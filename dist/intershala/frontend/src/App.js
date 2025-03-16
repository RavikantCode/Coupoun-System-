"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const Login_1 = __importDefault(require("./pages/Login"));
const AdminDashboard_1 = __importDefault(require("./pages/AdminDashboard"));
const react_hot_toast_1 = require("react-hot-toast");
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <react_hot_toast_1.Toaster position="top-center"/>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<Login_1.default />}/>
        <react_router_dom_1.Route path="/admin/*" element={<AdminDashboard_1.default />}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
