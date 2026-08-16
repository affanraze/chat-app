import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Form submission logic (e.g., API request)
    try {
      await register(formData);
      navigate("/chat", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please check your details.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased flex flex-col justify-center items-center px-4 py-12 selection:bg-zinc-800 selection:text-white">
      {/* Brand Header */}
      <Link to="/" className="mb-8 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-bold text-sm tracking-tighter">
          //
        </div>
        <span className="font-semibold text-sm tracking-wide text-zinc-100">
          signal<span className="text-zinc-500">.chat</span>
        </span>
      </Link>

      {/* Signup Form Card */}
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm shadow-2xl shadow-black/80">
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Create an account
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your details below to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-zinc-300 font-mono"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="alex_dev"
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-300 font-mono"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-300 font-mono"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
            <p className="text-[10px] text-zinc-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 rounded-md bg-zinc-100 px-3.5 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-sans"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-300 font-medium hover:underline focus:outline-none"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
