import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const [resendMessage, setResendMessage] = useState("");
   const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
    const handleResendVerification = async () => {
    if (!formData.email) {
        setError("Please enter your email first");
        return;
    }

    setError("");
    setResendMessage("");
    setResendLoading(true);

    try {
        const response = await axios.post(
        "http://localhost:5000/api/auth/resend-verification",
        {
            email: formData.email,
        }
        );

        setResendMessage(response.data.message);
    } catch (error) {
        setError(
        error.response?.data?.message ||
            "Unable to resend verification email."
        );
    } finally {
        setResendLoading(false);
    }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {resendMessage && (
            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                {resendMessage}
            </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Forgot Password */}
        <div className="flex items-center justify-between">
            <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="text-sm font-medium text-gray-700 hover:text-black disabled:opacity-50"
            >
                {resendLoading
                ? "Sending..."
                : "Resend verification email"}
            </button>

            <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-700 hover:text-black"
            >
                Forgot password?
            </Link>
            </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="px-4 text-sm text-gray-400">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          Continue with Google
        </button>

        {/* Apple */}
        <button
          type="button"
          className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 mt-3"
        >
          Continue with Apple
        </button>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-7">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-black hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;