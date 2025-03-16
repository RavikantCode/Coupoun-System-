import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTicketAlt, FaTag, FaArrowLeft, FaToggleOn, FaCog } from 'react-icons/fa';

interface CouponFormData {
  code: string;
  name: string;
  is_Available: boolean;
  is_Active: boolean;
}

const CreateCoupon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    name: '',
    is_Available: true,
    is_Active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/admin/create-coupon', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Coupon created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Create New Coupon
            </h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-slow opacity-70 blur-md"></div>
              <div className="relative bg-black/50 backdrop-blur-xl rounded-full p-6 border border-white/10">
                <FaTicketAlt className="text-4xl text-white" />
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Coupon Code Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Coupon Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter coupon code"
                  />
                </div>
              </div>

              {/* Coupon Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Coupon Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCog className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter coupon name"
                  />
                </div>
              </div>

              {/* Toggle Options */}
              <div className="bg-black/20 rounded-lg p-4 space-y-4">
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Available</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_Available}
                      onChange={(e) => setFormData({ ...formData, is_Available: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${formData.is_Available ? 'bg-blue-500' : 'bg-gray-600'}`}>
                      <div className={`absolute w-5 h-5 rounded-full bg-white top-1 transition-transform duration-300 ${formData.is_Available ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">Active</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_Active}
                      onChange={(e) => setFormData({ ...formData, is_Active: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${formData.is_Active ? 'bg-blue-500' : 'bg-gray-600'}`}>
                      <div className={`absolute w-5 h-5 rounded-full bg-white top-1 transition-transform duration-300 ${formData.is_Active ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 px-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all duration-300 transform hover:scale-105 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Coupon'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon; 