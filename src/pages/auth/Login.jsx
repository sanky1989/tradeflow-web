import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE (Hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-10 flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">TradeFlow</h1>
          <p className="text-lg opacity-90">
            Manage quotes, jobs, payments & operations in one powerful system.
          </p>

          <div className="mt-10 space-y-2 text-sm opacity-80">
            <p>✔ Smart workflow automation</p>
            <p>✔ Real-time tracking</p>
            <p>✔ Secure pricing control</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-6 sm:p-10">
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Login to continue to TradeFlow
          </p>

          <form className="space-y-4">
            
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="admin1@tradeflow.com"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <span className="text-indigo-600 cursor-pointer hover:underline">
                Forgot?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Login
            </button>

          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            © 2026 TradeFlow. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;