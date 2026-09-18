import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

    const checkPasswordStrength = (password) => {
    if (!password) {
      return "";
    }

    if (password.length < 8) {
      return "Weak";
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const score = [
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;

    if (password.length >= 12 && score >= 3) {
      return "Strong";
    }

    if (score >= 2) {
      return "Medium";
    }

    return "Weak";
  };

    const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (error) {
      setError("");
    }
  };
  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      return "Please enter your name";
    }

    if (!email.trim()) {
      return "Please enter your email";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (!password) {
      return "Please enter a password";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      return "Please confirm your password";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Sign up to get started
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

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
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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

          <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />
          {passwordStrength && (

          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Password strength
              </span>

              <span className="font-medium">
                {passwordStrength}
              </span>
            </div>

            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all ${
                  passwordStrength === "Weak"
                    ? "w-1/3 bg-red-500"
                    : passwordStrength === "Medium"
                    ? "w-2/3 bg-yellow-500"
                    : "w-full bg-green-500"
                }`}
              />
            </div>
          </div>
        )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

            <p className="text-xs text-gray-400 mt-2">
              Minimum 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>

            <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="px-4 text-sm text-gray-400">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
      <button
      type="button"
      onClick={() => {
        window.location.href =
          `${import.meta.env.VITE_API_URL}/auth/google`;
      }}
      className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
    >
      Continue with Google
    </button>


        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-black hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;