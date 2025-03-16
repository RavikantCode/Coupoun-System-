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
const axios_1 = __importDefault(require("axios"));
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
const IpInfo = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [ipInfo, setIpInfo] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchIpInfo = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get('http://localhost:5000/api/v1/coupon/ip', {
                    withCredentials: true
                });
                setIpInfo(response.data);
            }
            catch (error) {
                console.error('Error fetching IP info:', error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchIpInfo();
    }, []);
    return (<div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">IP Information</h1>
            </div>
            <div>
              <button onClick={() => navigate('/')} className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium transition-all flex items-center gap-2">
                <fa_1.FaArrowLeft /> Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4">
                <fa_1.FaInfoCircle className="text-3xl text-purple-300"/>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Connection Info</h2>
              <p className="text-purple-200">This information is used for coupon claiming</p>
            </div>

            {loading ? (<div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>) : ipInfo ? (<div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Local IP</h3>
                  <p className="text-purple-200">{ipInfo.localIp}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Public IP</h3>
                  <p className="text-purple-200">{ipInfo.publicIp}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Cookie ID</h3>
                  <p className="text-purple-200">{ipInfo.cookie_id || "Not set yet"}</p>
                </div>
                
                <div className="bg-yellow-500/20 rounded-lg p-4 mt-6">
                  <p className="text-yellow-200 text-sm">{ipInfo.note}</p>
                </div>
              </div>) : (<div className="text-center text-red-300">
                Failed to load IP information
              </div>)}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-purple-200 text-sm">
            &copy; {new Date().getFullYear()} Coupon System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>);
};
exports.default = IpInfo;
