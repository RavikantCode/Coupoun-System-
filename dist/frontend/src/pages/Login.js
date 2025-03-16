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
const Login = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [formData, setFormData] = (0, react_1.useState)({
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [loginError, setLoginError] = (0, react_1.useState)(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(Object.assign(Object.assign({}, formData), { [name]: value }));
        // Clear login error when user types
        if (loginError) {
            setLoginError(null);
        }
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setLoginError('Please enter both email and password');
            return;
        }
        setLoading(true);
        setLoginError(null);
        try {
            const endpoint = formData.role === 'admin'
                ? '/api/v1/admin/login'
                : '/api/v1/user/login';
            const response = yield axios_1.default.post(`http://localhost:5000${endpoint}`, formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', formData.role);
                react_hot_toast_1.default.success('Login successful!');
                // Redirect based on role
                if (formData.role === 'admin') {
                    navigate('/admin');
                }
                else {
                    navigate('/dashboard');
                }
            }
            else {
                setLoginError('Invalid response from server');
            }
        }
        catch (error) {
            console.error('Login error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            setLoginError(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) || 'Login failed. Please check your credentials.');
        }
        finally {
            setLoading(false);
        }
    });
    return (<div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#0f172a',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 0,
            margin: 0,
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }}>
      <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 40px',
            boxSizing: 'border-box'
        }}>
        {/* Header */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '40px'
        }}>
          <h1 style={{
            color: '#60a5fa',
            fontSize: '24px',
            fontWeight: 'bold'
        }}>
            Coupon System
          </h1>
          <button onClick={() => navigate('/')} style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
        }}>
            Claim Coupon
          </button>
        </div>

        {/* Main Content */}
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            flex: 1,
            position: 'relative'
        }}>
          {/* Login Form */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            padding: '40px',
            borderRadius: '8px',
            width: '45%',
            maxWidth: '500px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'center'
        }}>
            <h2 style={{
            color: '#a78bfa',
            fontSize: '32px',
            marginBottom: '12px',
            fontWeight: 'bold',
            textAlign: 'center'
        }}>
              Welcome back
            </h2>
            <p style={{
            color: '#94a3b8',
            marginBottom: '30px',
            fontSize: '16px',
            textAlign: 'center'
        }}>
              Sign in to manage your coupons
            </p>

            {loginError && (<div style={{
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '20px',
                border: '1px solid rgba(220, 38, 38, 0.3)'
            }}>
                {loginError}
              </div>)}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
            display: 'block',
            color: 'white',
            marginBottom: '8px',
            fontSize: '14px',
            textAlign: 'center'
        }}>
                  Role
                </label>
                <div style={{ position: 'relative' }}>
                  <fa_1.FaUser style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b'
        }}/>
                  <select name="role" value={formData.role} onChange={handleChange} style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '16px',
            boxSizing: 'border-box',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none'
        }}>
                    <option value="user" style={{ backgroundColor: '#1e293b' }}>User</option>
                    <option value="admin" style={{ backgroundColor: '#1e293b' }}>Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
            display: 'block',
            color: 'white',
            marginBottom: '8px',
            fontSize: '14px',
            textAlign: 'center'
        }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <fa_1.FaEnvelope style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b'
        }}/>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '16px',
            boxSizing: 'border-box'
        }}/>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
            display: 'block',
            color: 'white',
            marginBottom: '8px',
            fontSize: '14px',
            textAlign: 'center'
        }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <fa_1.FaLock style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b'
        }}/>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '16px',
            boxSizing: 'border-box'
        }}/>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(to right, #4f46e5, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
        }}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          {/* Decoration Side */}
          <div style={{
            width: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '300px',
            height: '200px',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '8px',
            transform: 'rotate(-12deg)',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            zIndex: 1
        }}></div>
            
            <div style={{
            position: 'absolute',
            top: '30%',
            left: '15%',
            width: '280px',
            height: '180px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            transform: 'rotate(8deg)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            zIndex: 1
        }}></div>
            
            <div style={{
            position: 'absolute',
            width: '350px',
            height: '220px',
            backgroundColor: 'rgba(88, 28, 135, 0.2)',
            borderRadius: '8px',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '30px',
            textAlign: 'center',
            zIndex: 2
        }}>
              <h2 style={{
            color: '#a78bfa',
            fontSize: '28px',
            marginBottom: '16px',
            fontWeight: 'bold'
        }}>
                Coupon Management
              </h2>
              <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            lineHeight: '1.5'
        }}>
                Log in to access your admin dashboard and manage your coupon distribution system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = Login;
