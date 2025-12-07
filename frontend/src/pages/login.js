// src/pages/login.js
import { useState } from "react";
import api from "../lib/api";
import { setAccessToken } from "../lib/auth";
import { useAuth } from "../stores/useAuth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loginWithAccessToken = useAuth((s) => s.loginWithAccessToken);

  const doLogin = async () => {
    if (!emailOrPhone || !password) return toast.error("Enter email and password");

    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/login", {
        email: emailOrPhone,
        password,
      });

      const { accessToken, user } = data;
      setAccessToken(accessToken);
      loginWithAccessToken(accessToken, user);

      toast.success("Logged in");
      router.replace("/");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-backdrop">
      <div className="bg-sides" aria-hidden>
        <div className="bg-left" />
        <div className="bg-right" />
      </div>

      <div className="auth-card">
        <div className="max-w-md mx-auto">
          <h3 className="text-center text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
            Welcome Back
          </h3>
          <p className="text-center text-sm text-gray-500 mb-6">
            Sign in to continue to TaskTracker
          </p>

          <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">Email ID</label>
          <input
            type="email"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Enter your registered email id"
            autoComplete="email"
            className="w-full p-3 border rounded-lg mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
            disabled={loading}
          />

          <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="w-full p-3 border rounded-lg mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
            disabled={loading}
          />

          <button
            onClick={doLogin}
            className={`w-full py-3 rounded-full btn-gradient text-white font-medium shadow-lg mb-4 ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
            disabled={loading}
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-400">New User? </span>
              <Link href="/signup" className="text-purple-600 font-medium">
                Sign Up
              </Link>
            </div>

            <Link href="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
