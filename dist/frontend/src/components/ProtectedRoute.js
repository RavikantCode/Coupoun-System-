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
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const verifyAuth = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield axios_1.default.get('http://localhost:5000/api/v1/admin/verify', {
                    withCredentials: true
                });
                setIsAuthenticated(true);
            }
            catch (error) {
                setIsAuthenticated(false);
                react_hot_toast_1.default.error('Please login to access this page');
            }
        });
        verifyAuth();
    }, []);
    if (isAuthenticated === null) {
        return (<div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>);
    }
    return isAuthenticated ? <>{children}</> : <react_router_dom_1.Navigate to="/" replace/>;
};
exports.default = ProtectedRoute;
