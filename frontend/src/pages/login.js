// src/pages/login.js
import { useState } from "react";
import api from "../lib/api";
import { setAccessToken } from "../lib/auth";
import { useAuth } from "../stores/useAuth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const loginWithAccessToken = useAuth((s) => s.loginWithAccessToken);

  const doLogin = async () => {
    if (!email || !password) {
      return toast.error("Enter email and password");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = data;

      setAccessToken(accessToken);
      loginWithAccessToken(accessToken, user);

      toast.success("Logged in");
      router.replace("/");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Login failed");
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
          <h3 className="text-center text-xl font-semibold mb-1">
            Welcome Back
          </h3>
          <p className="text-center text-sm text-gray-500 mb-6">
            Sign in to continue to TaskTracker
          </p>

          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full p-3 border rounded-lg mb-4"
            disabled={loading}
          />

          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="w-full p-3 border rounded-lg mb-6"
            disabled={loading}
          />

          <button
            onClick={doLogin}
            disabled={loading}
            className={`w-full py-3 rounded-full btn-gradient text-white font-medium shadow-lg mb-4 ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-400">New user? </span>
            <Link href="/signup" className="text-purple-600 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
