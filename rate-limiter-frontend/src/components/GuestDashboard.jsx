import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const GuestDashboard = () => {
  const [response, setResponse] = useState(null);
  const [rateLimit, setRateLimit] = useState({ limit: 5, remaining: 5 });
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("${process.env.REACT_APP_API_URL}");
      setResponse(result.data);
      setRateLimit({
        limit: result.headers["x-ratelimit-limit"] || 5,
        remaining: result.headers["x-ratelimit-remaining"] || 5,
      });
    } catch (error) {
      setResponse(error.response?.data || "Error");
      setRateLimit({
        limit: error.response?.headers["x-ratelimit-limit"] || 5,
        remaining: error.response?.headers["x-ratelimit-remaining"] || 5,
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
      className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white">Guest Access</h1>
        <p className="text-white/70 mt-2">Fixed Window Rate Limiting</p>
      </div>

      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80">Requests Limit:</span>
          <span className="font-bold text-white">{rateLimit.limit}/min</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full"
            style={{ width: `${(rateLimit.remaining / rateLimit.limit) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/50">0</span>
          <span className="text-xs text-white/50">{rateLimit.limit}</span>
        </div>
      </div>

      <motion.button
        onClick={sendRequest}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Testing...
          </>
        ) : (
          "Test Anonymous Request"
        )}
      </motion.button>

      {response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-black/10 rounded-lg p-4 border border-white/10"
        >
          <h3 className="text-white font-medium mb-2">API Response:</h3>
          <pre className="text-sm text-white/80 overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </motion.div>
      )}

      {response?.message?.includes("Too many requests") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-red-500/20 text-red-100 rounded-lg border border-red-500/30"
        >
          ⚠️ Rate limit exceeded! Wait 1 minute or log in for higher limits.
        </motion.div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-white/50">
          Guest users are limited to {rateLimit.limit} requests per minute.
        </p>
      </div>
    </motion.div>
  );
};

export default GuestDashboard;
