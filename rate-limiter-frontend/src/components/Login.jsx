import React, { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Login = ({ setJwtToken, setUserEmail, setIsGuest }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setJwtToken(token);
      setUserEmail(userCredential.user.email);
    } catch (err) {
      setError("Invalid credentials. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        <div className="p-8">
          {/* Logo/Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">API Rate Limiter</h1>
            <p className="text-white/70 mt-2">Secure access to your endpoints</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              variants={itemVariants}
              className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg border border-red-500/30"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form variants={containerVariants} onSubmit={handleLogin}>
            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/30 outline-none transition"
                placeholder="user@example.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/30 outline-none transition"
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </motion.button>
          </motion.form>

          {/* Guest Access */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <button
              onClick={() => setIsGuest(true)}
              className="text-white/70 hover:text-white underline underline-offset-4 transition"
            >
              Continue as Guest
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="bg-black/10 py-4 text-center border-t border-white/5"
        >
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} API Rate Limiter. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;