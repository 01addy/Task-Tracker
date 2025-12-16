// frontend/src/pages/signup.js
import { useState } from "react";
import api from "../lib/api";
import { setAccessToken } from "../lib/auth";
import { useAuth } from "../stores/useAuth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const loginWithAccessToken = useAuth((s) => s.loginWithAccessToken);

  const handleSignup = async () => {
    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const { accessToken, user } = data;

      setAccessToken(accessToken);
      loginWithAccessToken(accessToken, user);

      toast.success("Account created successfully");
      router.replace("/");
    } catch (e) {
      console.error("signup error:", e);
      toast.error(
        e?.response?.data?.error || "Unable to create account"
      );
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
            Create account
          </h3>
          <p className="text-center text-sm text-gray-500 mb-6">
            Sign up to get started with TaskTracker
          </p>

          <label className="block mb-2 text-sm">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full p-3 border rounded-lg mb-3"
          />

          <label className="block mb-2 text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg mb-3"
          />

          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            className="w-full p-3 border rounded-lg mb-4"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-3 rounded-full btn-gradient text-white font-medium shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-purple-600 font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
