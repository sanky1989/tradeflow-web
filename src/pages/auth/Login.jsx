import React, { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //backend expects capital keys
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  //input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      if (!res.Success) {
        setError(res.Message  || "Login failed");
        return;
      }
      const data = res?.Data;
      localStorage.setItem("token", data.AccessToken);
      setUser(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err?.message) {
        setError('Something went wrong');
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-accent  text-white p-10 flex-col justify-center">
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
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Login to continue to TradeFlow
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/*ERROR MESSAGE UI */}
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="admin1@tradeflow.com"
                required
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:opacity-90 text-white p-3 rounded-lg transition font-medium"
            >
              {loading ? "Logging in..." : "Login"}
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