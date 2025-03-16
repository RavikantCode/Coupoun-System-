import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaGift, FaSpinner, FaClock, FaTicketAlt, FaArrowRight, FaSync } from 'react-icons/fa';
import { API_ROUTES } from '../config/api';
import { API_BASE_URL } from '../config/api';

interface ClaimedCoupon {
  code: string;
  claimed_at: string;
  expires_at: string;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const ClaimCoupon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState<ClaimedCoupon | null>(null);
  const [cooldownTime, setCooldownTime] = useState<string | null>(null);
  const [nextAvailable, setNextAvailable] = useState<Date | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [isButtonExpanded, setIsButtonExpanded] = useState(false);
  const [couponsAvailable, setCouponsAvailable] = useState<boolean>(true);

  useEffect(() => {
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
          floatingButton?.classList.remove('animate-bounce');
        }, 1000);
      }
    }, 3000);

    return () => clearTimeout(bounceTimeout);
  }, []);

  useEffect(() => {
    // Update countdown timer every minute
    if (nextAvailable) {
      const interval = setInterval(() => {
        if (nextAvailable > new Date()) {
          setCooldownTime(getTimeLeft(nextAvailable));
        } else {
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

  const getTimeLeft = (expiryDate: Date): string => {
    const diff = expiryDate.getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleClaimCoupon = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/coupon/claim', {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setClaimedCoupon(response.data.coupon);
        localStorage.setItem('claimedCoupon', JSON.stringify(response.data.coupon));
        
        const expiryDate = new Date(response.data.coupon.expires_at);
        setNextAvailable(expiryDate);
        setCooldownTime(getTimeLeft(expiryDate));
        
        toast.success('Coupon claimed successfully!');
      }
    } catch (error: any) {
      // Handle the out of stock response
      if (error.response?.data?.message === 'Sorry, all coupons are out of stock!') {
        toast.error('Sorry, all coupons are out of stock!');
        setCouponsAvailable(false);
      } else {
        toast.error(error.response?.data?.message || 'Failed to claim coupon');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleFloatingButton = () => {
    setIsButtonExpanded(!isButtonExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] flex flex-col">
      {/* Simplified Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 h-16">
        <div className="max-w-5xl mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <h1 className="text-2xl font-bold text-white">Coupon System</h1>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Centered Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">
              Claim Your Coupon
            </h2>
            <p className="text-gray-400">
              Get exclusive discounts with our daily coupons
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-6">
            {claimedCoupon ? (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 mb-2">Your coupon code:</p>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <span className="text-2xl font-bold text-white">
                      {claimedCoupon.code}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">Claimed on:</p>
                  <p className="text-white">
                    {new Date(claimedCoupon.claimed_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Cooldown period:</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {cooldownTime}
                  </p>
                </div>
              </div>
            ) : cooldownTime ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-yellow-400 text-xl mb-2">On Cooldown</p>
                  <p className="text-gray-400 mb-2">
                    You need to wait before claiming another coupon
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {cooldownTime}
                  </p>
                </div>
                
                <p className="text-gray-400 text-sm text-center">
                  Next available: {nextAvailable?.toLocaleString()}
                </p>
              </div>
            ) : (
              <button
                onClick={handleClaimCoupon}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-2xl" />
                    <span className="text-lg">Claiming...</span>
                  </>
                ) : (
                  <>
                    <FaTicketAlt className="text-2xl group-hover:rotate-12 transition-transform" />
                    <span className="text-lg">Claim Your Coupon</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-xl border-t border-white/10 h-12">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Coupon System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClaimCoupon; 