import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTicketAlt, FaTag, FaHistory, FaClock, FaUser } from 'react-icons/fa';

interface ClaimHistory {
  user_id: string;
  claimed_at: string;
}

interface CouponData {
  code: string;
  name: string;
  is_Available: boolean;
  is_Active: boolean;
  claim_history: ClaimHistory[];
}

const EditCoupon = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CouponData>({
    code: '',
    name: '',
    is_Available: true,
    is_Active: true,
    claim_history: []
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://coupoun-system.onrender.com/api/v1/admin/edit-coupon/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(response.data.coupon);
      } catch (error: any) {
        toast.error(error.response?.data?.msg || 'Failed to fetch coupon');
        navigate('/admin/coupons');
      }
    };

    fetchCoupon();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://coupoun-system.onrender.com/api/v1/admin/edit-coupon/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Coupon updated successfully');
      navigate('/admin/coupons');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Coupon</h2>
              <FaTicketAlt className="text-2xl text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coupon Code
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTag className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coupon Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTicketAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_Available"
                        checked={formData.is_Available}
                        onChange={(e) => setFormData({ ...formData, is_Available: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_Available" className="ml-2 block text-sm text-gray-900">
                        Available
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_Active"
                        checked={formData.is_Active}
                        onChange={(e) => setFormData({ ...formData, is_Active: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_Active" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/coupons')}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FaHistory className="text-indigo-600" />
                      Claim History
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formData.claim_history.length} claims
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {formData.claim_history.length > 0 ? (
                      formData.claim_history.map((claim, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {claim.user_id}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaClock className="text-gray-400" />
                              {formatDate(claim.claimed_at)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No claims yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoupon; 
