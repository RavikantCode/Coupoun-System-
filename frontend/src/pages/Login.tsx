import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
        if (loginError) {
      setLoginError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      const response = await axios.post(`https://coupoun-system.onrender.com${endpoint}`, formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', formData.role);
        
        toast.success('Login successful!');
                if (formData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setLoginError('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      setLoginError(error.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
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
      }}>        <div style={{ 
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
          <button 
            onClick={() => navigate('/')}
            style={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Claim Coupon
          </button>
        </div>

        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          flex: 1,
          position: 'relative'
        }}>
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

            {loginError && (
              <div style={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '20px',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                {loginError}
              </div>
            )}

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
                  <FaUser style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{ 
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
                    }}
                  >
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
                  <FaEnvelope style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    style={{ 
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(51, 65, 85, 0.8)',
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
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
                  <FaLock style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{ 
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(51, 65, 85, 0.8)',
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ 
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
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

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
    </div>
  );
};

export default Login; 
