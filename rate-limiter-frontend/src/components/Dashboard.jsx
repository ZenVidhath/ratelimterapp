import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = ({ jwtToken, showGuestInfo = false }) => {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [response, setResponse] = useState(null);
  const [rateLimit, setRateLimit] = useState({ limit: showGuestInfo ? 5 : 10, remaining: showGuestInfo ? 5 : 10 });
  const [isLoading, setIsLoading] = useState(false);

  const handleMethodChange = (e) => setMethod(e.target.value);
  const handleEndpointChange = (e) => setEndpoint(e.target.value);

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const result = await axios({
        method,
        url: `${process.env.REACT_APP_API_URL}${endpoint}`,
        headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}
      });

      setResponse(result.data);
      setRateLimit({
        limit: result.headers['x-ratelimit-limit'] || (showGuestInfo ? 5 : 10),
        remaining: result.headers['x-ratelimit-remaining'] || (showGuestInfo ? 5 : 10),
      });
    } catch (error) {
      setResponse(error.response?.data || { message: 'API Error' });
      setRateLimit({
        limit: error.response?.headers['x-ratelimit-limit'] || (showGuestInfo ? 5 : 10),
        remaining: error.response?.headers['x-ratelimit-remaining'] || (showGuestInfo ? 5 : 10),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 p-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">API Test Dashboard</h2>
          {showGuestInfo && (
            <p className="text-indigo-200">Guest Mode: Limited to 5 requests per minute</p>
          )}
        </motion.div>

        {/* Request Controls */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-white/80 mb-2">Request Method</label>
              <div className="relative">
                <select
                  id="method"
                  className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/50 text-white outline-none appearance-none"
                  value={method}
                  onChange={handleMethodChange}
                >
                  <option value="GET" className="bg-gray-800">GET</option>
                  <option value="POST" className="bg-gray-800">POST</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="endpoint" className="block text-sm font-medium text-white/80 mb-2">API Endpoint</label>
              <input
                id="endpoint"
                type="text"
                className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-white/30 outline-none"
                value={endpoint}
                onChange={handleEndpointChange}
                placeholder="/protected"
              />
            </div>
          </div>

          <motion.button
            onClick={sendRequest}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Request...
              </>
            ) : (
              'Send API Request'
            )}
          </motion.button>
        </motion.div>

        {/* Rate Limit Indicator */}
        <motion.div 
          className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80">Rate Limit:</span>
            <span className="font-bold text-white">
              {rateLimit.remaining}/{rateLimit.limit} requests
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${rateLimit.remaining/rateLimit.limit < 0.2 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
              style={{ width: `${(rateLimit.remaining / rateLimit.limit) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Response Section */}
        {response && (
          <motion.div 
            className="mt-8 bg-black/10 rounded-lg p-4 border border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <h3 className="text-white font-medium mb-2">API Response:</h3>
            <pre className="text-sm text-white/80 overflow-x-auto bg-black/20 p-3 rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </motion.div>
        )}

        {response?.message?.includes("Too many requests") && (
          <motion.div 
            className="mt-4 p-3 bg-red-500/20 text-red-100 rounded-lg border border-red-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ {response.message} {showGuestInfo && "(Log in for higher limits)"}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;