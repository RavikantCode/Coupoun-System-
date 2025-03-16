import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSignOutAlt, FaPlus, FaHistory, FaToggleOn, FaToggleOff, FaTrash, FaListAlt } from 'react-icons/fa';

interface Coupon {
  _id: string;
  code: string;
  is_Available: boolean;
  is_Active?: boolean;
  isClaimed: boolean;
  createdAt?: string;
  updatedAt?: string;
  claim_history?: {
    user_id: string;
    claimed_at: string;
    ip_address?: string;
    public_ip?: string;
    cookie_id?: string;
  }[];
}

interface ClaimRecord {
  coupon_code: string;
  ip_address: string;
  public_ip: string;
  cookie_id: string;
  claimed_at: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  return {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string>('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [allClaims, setAllClaims] = useState<ClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [showAllClaims, setShowAllClaims] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    is_Available: true,
    is_Active: true
  });
  const [deletingCoupon, setDeletingCoupon] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/login');
      return;
    }

    setUserRole(role || '');
    fetchCoupons();
    fetchAllClaims();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCoupons();
        fetchAllClaims();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('popstate', fetchCoupons);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', fetchCoupons);
    };
  }, [navigate, location]);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }
      
      console.log('Fetching coupons with token:', token.substring(0, 10) + '...');
      
      const authConfig = getAuthHeaders();
      if (!authConfig) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }
      
      const response = await axios.get('https://coupoun-system.onrender.com/api/v1/admin/coupons?includeAll=true', authConfig);
      
      console.log('Coupons response:', response.data);
      
      if (response.data && response.data.coupons && Array.isArray(response.data.coupons)) {
        setCoupons(response.data.coupons);
      } else if (response.data && Array.isArray(response.data)) {
        setCoupons(response.data);
      } else {
        toast.error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Fetch error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClaims = async () => {
    try {
      setClaimsLoading(true);
      const authConfig = getAuthHeaders();
      if (!authConfig) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }
      
      const response = await axios.get('https://coupoun-system.onrender.com/api/v1/admin/claim-history', authConfig);
      
      if (response.data && response.data.claims) {
        setAllClaims(response.data.claims);
      } else {
        toast.error('Failed to fetch claim history');
      }
    } catch (error: any) {
      console.error('Error fetching all claims:', error.response?.data || error.message);
      toast.error('Failed to fetch claim history');
    } finally {
      setClaimsLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authConfig = getAuthHeaders();
      if (!authConfig) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }
      
      console.log('Creating coupon:', newCoupon);
      
      const response = await axios.post(
        'https://coupoun-system.onrender.com/api/v1/admin/create-coupon', 
        newCoupon,
        authConfig
      );
      
      console.log('Create response:', response.data);
      toast.success('Coupon created successfully');
      setIsCreateModalOpen(false);
      setNewCoupon({ code: '', is_Available: true, is_Active: true });
      fetchCoupons();
    } catch (error: any) {
      console.error('Create error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || 'Failed to create coupon');
    }
  };

  const toggleCouponStatus = async (couponCode: string, field: 'is_Active' | 'is_Available') => {
    try {
      const authConfig = getAuthHeaders();
      if (!authConfig) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }
      
      console.log(`Toggling ${field} for coupon:`, couponCode);
      
      const response = await axios.post(
        'http://localhost:5000/api/v1/admin/toggle-coupon', 
        { code: couponCode }, 
        authConfig
      );
      
      console.log('Toggle response:', response.data);
      toast.success('Status updated successfully');
      fetchCoupons();
    } catch (error: any) {
      console.error('Toggle error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || 'Failed to update status');
    }
  };

  const handleDeleteCoupon = async (couponCode: string) => {
    if (window.confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) {
      try {
        setDeletingCoupon(couponCode);
        
        const authConfig = getAuthHeaders();
        if (!authConfig) {
          toast.error('Authentication token missing. Please log in again.');
          navigate('/login');
          return;
        }
        
        console.log('Deleting coupon with code:', couponCode);
        
        const response = await axios.post(
          'https://coupoun-system.onrender.com/api/v1/admin/delete-coupon', 
          { code: couponCode },
          authConfig
        );
        
        console.log('Delete response:', response.data);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error: any) {
        console.error('Delete error details:', error.response?.data || error.message);
        toast.error(error.response?.data?.msg || 'Failed to delete coupon');
      } finally {
        setDeletingCoupon(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const viewClaimHistory = async (coupon: Coupon) => {
    try {
      if (coupon.claim_history && coupon.claim_history.length > 0) {
        setSelectedCoupon(coupon);
        setIsHistoryModalOpen(true);
        return;
      }
      
      const authConfig = getAuthHeaders();
      if (!authConfig) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }
      
      const toastId = toast.loading('Fetching claim history...');
      
      try {
        const response = await axios.get(`https://coupoun-system.onrender.com/api/v1/admin/edit-coupon/${coupon._id}`, authConfig);
        
        toast.dismiss(toastId);
        
        if (response.data && response.data.coupon) {
          setSelectedCoupon(response.data.coupon);
          setIsHistoryModalOpen(true);
        } else {
          const claimResponse = await axios.get(`https://coupoun-system.onrender.com/api/v1/admin/claim-history`, authConfig);
          
          if (claimResponse.data && claimResponse.data.claims) {
            const couponClaims = claimResponse.data.claims.filter(
              (claim: any) => claim.coupon_code === coupon.code
            );
            
            const couponWithHistory = {
              ...coupon,
              claim_history: couponClaims.map((claim: any) => ({
                user_id: 'Anonymous', 
                claimed_at: claim.claimed_at,
                ip_address: claim.ip_address || 'N/A',
                public_ip: claim.public_ip || 'N/A',
                cookie_id: claim.cookie_id || 'N/A'
              }))
            };
            
            setSelectedCoupon(couponWithHistory);
            setIsHistoryModalOpen(true);
          } else {
            toast.error('No claim history found for this coupon');
          }
        }
      } catch (error: any) {
        toast.dismiss(toastId);
        console.error('Error fetching claim history:', error.response?.data || error.message);
        toast.error('Failed to fetch claim history');
      }
    } catch (error: any) {
      toast.dismiss();
      console.error('Error fetching claim history:', error.response?.data || error.message);
      toast.error('Failed to fetch claim history');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f3c] text-white">
      <nav className="bg-[#151a30] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                {userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2d3555] rounded-lg hover:bg-[#373f61]"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {userRole === 'admin' ? (
            <div className="space-y-6">
              <div className="bg-[#151a30] rounded-xl border border-white/10 p-6 shadow-xl">
                <div className="flex flex-col items-center justify-center mb-8 space-y-6">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Coupon Management
                  </h2>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowAllClaims(!showAllClaims)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2d3555] text-white rounded-lg hover:bg-[#373f61]"
                    >
                      <FaListAlt /> {showAllClaims ? 'Hide Claims' : 'View All Claims'}
                    </button>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2d3555] text-white rounded-lg hover:bg-[#373f61]"
                    >
                      <FaPlus /> Create Coupon
                    </button>
                  </div>
                </div>

                {showAllClaims && (
                  <div className="bg-[#151a30] rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="px-6 py-4 bg-[#1d2340]">
                      <h3 className="text-lg font-medium text-white">All Claimed Coupons</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#2d3555]">
                        <thead className="bg-[#1d2340]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Coupon Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Local IP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Public IP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Cookie ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Claimed At
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d3555]">
                          {allClaims.map((claim, index) => (
                            <tr key={index} className="hover:bg-[#1d2340]">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{claim.coupon_code}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{claim.ip_address}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{claim.public_ip}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{claim.cookie_id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(claim.claimed_at).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="bg-[#151a30] rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#2d3555]">
                      <thead className="bg-[#1d2340]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Availability
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Claimed
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3555]">
                        {coupons.map((coupon) => (
                          <tr key={coupon._id} className="hover:bg-[#1d2340]">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{coupon.code}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleCouponStatus(coupon.code, 'is_Active')}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                  coupon.is_Active !== false && !coupon.isClaimed
                                    ? 'bg-green-900/50 text-green-300'
                                    : 'bg-red-900/50 text-red-300'
                                }`}
                              >
                                {coupon.is_Active !== false && !coupon.isClaimed ? <FaToggleOn /> : <FaToggleOff />}
                                {coupon.is_Active !== false && !coupon.isClaimed ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleCouponStatus(coupon.code, 'is_Available')}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                  coupon.is_Available
                                    ? 'bg-green-900/50 text-green-300'
                                    : 'bg-red-900/50 text-red-300'
                                }`}
                              >
                                {coupon.is_Available ? <FaToggleOn /> : <FaToggleOff />}
                                {coupon.is_Available ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                coupon.isClaimed
                                  ? 'bg-purple-900/50 text-purple-300'
                                  : 'bg-gray-700/50 text-gray-300'
                              }`}>
                                {coupon.isClaimed ? 'Claimed' : 'Not Claimed'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                              <button
                                onClick={() => viewClaimHistory(coupon)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <FaHistory className="inline-block mr-1" /> History ({coupon.claim_history?.length || 0})
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.code)}
                                disabled={deletingCoupon === coupon.code}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FaTrash className="inline-block mr-1" /> {deletingCoupon === coupon.code ? 'Deleting...' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#151a30] rounded-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                User Dashboard
              </h2>
              <p className="text-gray-300">Welcome to your dashboard! Here you can manage your account and view your coupon history.</p>
            </div>
          )}
        </div>
      </main>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e]/90 rounded-xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
              Create New Coupon
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newCoupon.is_Available}
                    onChange={(e) => setNewCoupon({ ...newCoupon, is_Available: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Available</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newCoupon.is_Active}
                    onChange={(e) => setNewCoupon({ ...newCoupon, is_Active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHistoryModalOpen && selectedCoupon && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-8 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Claim Details for Coupon: <span className="text-blue-400">{selectedCoupon.code}</span>
              </h3>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {selectedCoupon.claim_history && selectedCoupon.claim_history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Local IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Public IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cookie ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claimed At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {selectedCoupon.claim_history.map((claim, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {claim.ip_address || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {claim.public_ip || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {claim.cookie_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(claim.claimed_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
                No claim information available for this coupon.
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 border border-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
