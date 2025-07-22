import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import GuestDashboard from "./components/GuestDashboard";
import "./App.css";

const App = () => {
  const [jwtToken, setJwtToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const handleLogout = () => {
    setJwtToken(null);
    setUserEmail("");
    setIsGuest(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      {/* Header remains visible in all states */}
      <h1 className="text-2xl font-bold text-center text-white py-4">
        API Rate Limiter Frontend
      </h1>

      {!jwtToken && !isGuest ? (
        // Show login page if not logged in and not in guest mode
        <Login 
          setJwtToken={setJwtToken} 
          setUserEmail={setUserEmail} 
          setIsGuest={setIsGuest}
        />
      ) : (
        // Show either guest or authenticated dashboard
        <div className="pb-8">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl text-white">
              Welcome, {isGuest ? "Guest" : userEmail}
            </h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              {isGuest ? "Exit Guest Mode" : "Logout"}
            </button>
          </div>

          {/* Main content area */}
          <div className="px-4">
            {isGuest ? (
              // Guest Dashboard with full styling context
              <div className="flex justify-center">
                <GuestDashboard />
              </div>
            ) : (
              // Regular Dashboard for authenticated users
              <Dashboard jwtToken={jwtToken} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;