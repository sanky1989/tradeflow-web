import React, { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // clear field error on typing
    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // 🔹 Validation
  const validate = () => {
    let errors = {};
    setError("");
    if (!formData.Email) {
      errors.Email = "Email is required";
    }

    if (!formData.Password) {
      errors.Password = "Password is required";
    } else if (formData.Password.length < 6) {
      errors.Password = "Password must be at least 6 characters long";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      if (!res.Success) {
        setError(res.Message || "Invalid email or password.");
        return;
      }
      const data = res.Data;
      if (remember) {
        localStorage.setItem("token", data.AccessToken);
      } else {
        sessionStorage.setItem("token", data.AccessToken);
      }
      setUser(data);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.Message ||
        err?.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-gray-200 text-black p-10 flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">TradeFlow</h1>
          <p className="text-lg opacity-90">
            Manage quotes, jobs, payments & operations in one powerful system.
          </p>
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full mt-1 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black placeholder-black-400"
              />
              {fieldErrors.Email && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.Email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-black placeholder-black-400"
              />
              {fieldErrors.Password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.Password}
                </p>
              )}
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                <span className="text-gray-600">Remember me</span>
              </label>

              <button
                type="button"
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* BUTTON */}
           <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-accent hover:opacity-90 text-white p-3 rounded-lg transition font-medium disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            © 2026 TradeFlow
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;