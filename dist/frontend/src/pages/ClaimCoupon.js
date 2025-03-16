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
const ClaimCoupon = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [claimedCoupon, setClaimedCoupon] = (0, react_1.useState)(null);
    const [cooldownTime, setCooldownTime] = (0, react_1.useState)(null);
    const [nextAvailable, setNextAvailable] = (0, react_1.useState)(null);
    const [showFloatingButton, setShowFloatingButton] = (0, react_1.useState)(true);
    const [isButtonExpanded, setIsButtonExpanded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Check if there's a coupon in localStorage
        const savedCoupon = localStorage.getItem('claimedCoupon');
        if (savedCoupon) {
            const coupon = JSON.parse(savedCoupon);
            setClaimedCoupon(coupon);
            // Check if the coupon is still valid
            const expiryDate = new Date(coupon.expires_at);
            if (expiryDate > new Date()) {
                const timeLeft = getTimeLeft(expiryDate);
                setCooldownTime(timeLeft);
                setNextAvailable(expiryDate);
            }
        }
        // Add a bounce effect to the floating button after a delay
        const bounceTimeout = setTimeout(() => {
            const floatingButton = document.querySelector('.floating-ticket-button');
            if (floatingButton) {
                floatingButton.classList.add('animate-bounce');
                setTimeout(() => {
                    floatingButton === null || floatingButton === void 0 ? void 0 : floatingButton.classList.remove('animate-bounce');
                }, 1000);
            }
        }, 3000);
        return () => clearTimeout(bounceTimeout);
    }, []);
    (0, react_1.useEffect)(() => {
        // Update countdown timer every minute
        if (nextAvailable) {
            const interval = setInterval(() => {
                if (nextAvailable > new Date()) {
                    setCooldownTime(getTimeLeft(nextAvailable));
                }
                else {
                    setCooldownTime(null);
                    setNextAvailable(null);
                    setClaimedCoupon(null);
                    localStorage.removeItem('claimedCoupon');
                    clearInterval(interval);
                }
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [nextAvailable]);
    const getTimeLeft = (expiryDate) => {
        const diff = expiryDate.getTime() - new Date().getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };
    const handleClaimCoupon = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        setLoading(true);
        try {
            const response = yield axios_1.default.post('http://localhost:5000/api/v1/coupon/test-claim', {}, {
                withCredentials: true
            });
            if (response.data.success) {
                setClaimedCoupon(response.data.coupon);
                localStorage.setItem('claimedCoupon', JSON.stringify(response.data.coupon));
                const expiryDate = new Date(response.data.coupon.expires_at);
                setNextAvailable(expiryDate);
                setCooldownTime(getTimeLeft(expiryDate));
                react_hot_toast_1.default.success('Coupon claimed successfully!');
            }
        }
        catch (error) {
            if ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.nextAvailable) {
                const nextAvailableDate = new Date(error.response.data.nextAvailable);
                setNextAvailable(nextAvailableDate);
                setCooldownTime(getTimeLeft(nextAvailableDate));
            }
            react_hot_toast_1.default.error(((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || 'Failed to claim coupon');
        }
        finally {
            setLoading(false);
        }
    });
    const handleLogin = () => {
        navigate('/login');
    };
    const toggleFloatingButton = () => {
        setIsButtonExpanded(!isButtonExpanded);
    };
    const resetCouponInBackend = (code) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            setLoading(true);
            const response = yield axios_1.default.post('http://localhost:5000/api/v1/coupon/reset-coupon', { code }, { withCredentials: true });
            if (response.data.success) {
                localStorage.removeItem('claimedCoupon');
                setClaimedCoupon(null);
                setCooldownTime(null);
                setNextAvailable(null);
                react_hot_toast_1.default.success('Coupon reset successfully! You can claim again.');
            }
        }
        catch (error) {
            console.error('Reset error:', error);
            react_hot_toast_1.default.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to reset coupon');
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Coupon System</h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/ip-info')} className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium transition-all">
                View IP Info
              </button>
              <button onClick={handleLogin} className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium transition-all">
                Login
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4 animate-float">
                <fa_1.FaGift className="text-3xl text-purple-300"/>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Claim Your Coupon</h2>
              <p className="text-purple-200">Get exclusive discounts with our daily coupons</p>
            </div>

            {claimedCoupon ? (<div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="text-sm text-purple-200 mb-2">Your coupon code:</div>
                <div className="text-2xl font-bold text-white bg-purple-600/30 py-3 px-4 rounded-md mb-4 tracking-wider animate-pulse-slow">
                  {claimedCoupon.code}
                </div>
                <div className="text-sm text-purple-200 mb-1">Claimed on:</div>
                <div className="text-white mb-4">
                  {new Date(claimedCoupon.claimed_at).toLocaleString()}
                </div>
                <div className="flex items-center justify-center gap-2 text-yellow-300 mb-1">
                  <fa_1.FaClock /> 
                  <span>Cooldown period:</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {cooldownTime}
                </div>
                <button onClick={() => {
                // Get the coupon code from localStorage to ensure we have the latest value
                const savedCoupon = localStorage.getItem('claimedCoupon');
                if (savedCoupon) {
                    const coupon = JSON.parse(savedCoupon);
                    resetCouponInBackend(coupon.code);
                }
                else {
                    // Fallback to local reset if no coupon code
                    localStorage.removeItem('claimedCoupon');
                    setClaimedCoupon(null);
                    setCooldownTime(null);
                    setNextAvailable(null);
                    react_hot_toast_1.default.success('Cooldown period cleared! You can claim again.');
                }
            }} className="mt-4 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-white rounded-md transition-colors">
                  Reset Coupon (Testing Only)
                </button>
              </div>) : cooldownTime ? (<div className="bg-white/10 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-300 mb-3">
                  <fa_1.FaClock className="text-xl animate-pulse-slow"/> 
                  <span className="text-lg">On cooldown</span>
                </div>
                <p className="text-purple-200 mb-4">
                  You need to wait before claiming another coupon
                </p>
                <div className="text-2xl font-bold text-white">
                  {cooldownTime}
                </div>
                <p className="text-purple-200 mt-4 text-sm">
                  Next available: {nextAvailable === null || nextAvailable === void 0 ? void 0 : nextAvailable.toLocaleString()}
                </p>
                <button onClick={() => {
                // Get the coupon code from localStorage to ensure we have the latest value
                const savedCoupon = localStorage.getItem('claimedCoupon');
                if (savedCoupon) {
                    const coupon = JSON.parse(savedCoupon);
                    resetCouponInBackend(coupon.code);
                }
                else {
                    // Fallback to local reset if no coupon code
                    localStorage.removeItem('claimedCoupon');
                    setClaimedCoupon(null);
                    setCooldownTime(null);
                    setNextAvailable(null);
                    react_hot_toast_1.default.success('Cooldown period cleared! You can claim again.');
                }
            }} className="mt-4 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-white rounded-md transition-colors">
                  Reset Coupon (Testing Only)
                </button>
              </div>) : (<button onClick={handleClaimCoupon} disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition duration-200 disabled:opacity-50 flex items-center justify-center">
                {loading ? (<>
                    <fa_1.FaSpinner className="animate-spin mr-2"/>
                    Claiming...
                  </>) : ('Claim Coupon')}
              </button>)}
          </div>
        </div>
      </main>

      {/* Floating Ticket Claimer Button */}
      {showFloatingButton && (<div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out ${isButtonExpanded ? 'w-64' : 'w-16'}`}>
          <button onClick={isButtonExpanded ? handleClaimCoupon : toggleFloatingButton} disabled={loading || !!cooldownTime} className={`floating-ticket-button group relative overflow-hidden rounded-full shadow-lg ${isButtonExpanded
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full py-3 px-6'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-16 h-16'} transition-all duration-300 ease-in-out transform hover:scale-105 ${(loading || !!cooldownTime) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isButtonExpanded ? (<div className="flex items-center justify-between w-full">
                <span className="text-white font-medium">Claim Ticket</span>
                <fa_1.FaArrowRight className="text-white"/>
              </div>) : (<>
                <fa_1.FaTicketAlt className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
                {/* Pulse effect */}
                <span className="absolute inset-0 rounded-full animate-ping opacity-75 bg-white"></span>
                <span className="absolute inset-0 rounded-full animate-pulse-slow bg-gradient-to-r from-purple-400 to-blue-400 opacity-75"></span>
              </>)}
          </button>
          
          {!isButtonExpanded && (<div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm py-2 px-4 rounded-lg shadow-lg" style={{ opacity: 0, animation: 'fadeIn 0.3s ease-in-out forwards 0.5s' }}>
              Claim Your Ticket Now!
            </div>)}
        </div>)}

      {/* Footer */}
      <footer className="bg-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-purple-200 text-sm">
            &copy; {new Date().getFullYear()} Coupon System. All rights reserved.
          </p>
        </div>
      </footer>

      {/* CSS for animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .7; }
        }
        
        /* Removed shimmer animation */
        `}
      </style>
    </div>);
};
exports.default = ClaimCoupon;
