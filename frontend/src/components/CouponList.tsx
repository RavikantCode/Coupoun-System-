import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaHistory, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Coupon {
  _id: string;
  code: string;
  name: string;
  is_Available: boolean;
  is_Active: boolean;
  claim_history: {
    user_id: string;
    claimed_at: string;
  }[];
}

const CouponList = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    is_Available: true,
    is_Active: true
  });

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/admin/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(response.data.coupons.sort((a: Coupon, b: Coupon) => 
        new Date(b.claim_history[0]?.claimed_at || 0).getTime() - 
        new Date(a.claim_history[0]?.claimed_at || 0).getTime()
      ));
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/admin/create-coupon', newCoupon, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Coupon created successfully');
      setIsCreateModalOpen(false);
      setNewCoupon({ code: '', name: '', is_Available: true, is_Active: true });
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  const toggleCouponStatus = async (couponId: string, field: 'is_Active' | 'is_Available') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/admin/toggle-coupon', 
        { code: couponId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md"
        >
          <FaPlus /> Create Coupon
        </button>
      </div>

      {/* Coupon Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleCouponStatus(coupon._id, 'is_Active')}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        coupon.is_Active
                          ? 'text-green-800 bg-green-100 hover:bg-green-200'
                          : 'text-red-800 bg-red-100 hover:bg-red-200'
                      }`}
                    >
                      {coupon.is_Active ? <FaToggleOn /> : <FaToggleOff />}
                      {coupon.is_Active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleCouponStatus(coupon._id, 'is_Available')}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        coupon.is_Available
                          ? 'text-green-800 bg-green-100 hover:bg-green-200'
                          : 'text-red-800 bg-red-100 hover:bg-red-200'
                      }`}
                    >
                      {coupon.is_Available ? <FaToggleOn /> : <FaToggleOff />}
                      {coupon.is_Available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => navigate(`/admin/coupons/history/${coupon._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaHistory className="inline-block mr-1" /> History
                    </button>
                    <button
                      onClick={() => navigate(`/admin/coupons/edit/${coupon._id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FaEdit className="inline-block mr-1" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newCoupon.name}
                  onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCoupon.is_Available}
                    onChange={(e) => setNewCoupon({ ...newCoupon, is_Available: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCoupon.is_Active}
                    onChange={(e) => setNewCoupon({ ...newCoupon, is_Active: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponList; 