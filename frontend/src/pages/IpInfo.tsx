import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

interface IpInfo {
  message: string;
  localIp: string;
  publicIp: string;
  cookie_id: string;
  note: string;
}

const IpInfo = () => {
  const navigate = useNavigate();
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/coupon/ip', {
          withCredentials: true
        });
        setIpInfo(response.data);
      } catch (error) {
        console.error('Error fetching IP info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">IP Information</h1>
            </div>
            <div>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium transition-all flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4">
                <FaInfoCircle className="text-3xl text-purple-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Connection Info</h2>
              <p className="text-purple-200">This information is used for coupon claiming</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : ipInfo ? (
              <div className="space-y-4">
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
              </div>
            ) : (
              <div className="text-center text-red-300">
                Failed to load IP information
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-purple-200 text-sm">
            &copy; {new Date().getFullYear()} Coupon System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IpInfo; 