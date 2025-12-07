import { useState } from "react";
import api from "../lib/api";
import { setAccessToken } from "../lib/auth";
import { useAuth } from "../stores/useAuth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const router = useRouter();
  const loginWithAccessToken = useAuth((s) => s.loginWithAccessToken);

  // Request OTP
  const requestOtp = async () => {
    if (!identifier) return toast.error("Enter email");

    try {
      setLoadingSend(true);

      await api.post("/api/auth/send-otp", {
        email: identifier,
        purpose: "signup",
      });

      toast.success("OTP sent (check your email)");
      setStep(2);
    } catch (e) {
      console.error("requestOtp error:", e);
      toast.error(e?.response?.data?.error || "Unable to send OTP");
    } finally {
      setLoadingSend(false);
    }
  };

  // Verify OTP + create account
  const verifyOtp = async () => {
    if (!otp || !password)
      return toast.error("Enter OTP and password");

    try {
      setLoadingVerify(true);

      const payload = {
        email: identifier,
        otp,
        password,
        name,
        purpose: "signup",
      };

      const { data } = await api.post("/api/auth/verify-otp", payload);

      const { accessToken, user } = data;
      setAccessToken(accessToken);
      loginWithAccessToken(accessToken, user);

      toast.success("Account created");
      router.replace("/");
    } catch (e) {
      console.error("verifyOtp error:", e);
      toast.error(e?.response?.data?.error || "Invalid OTP");
    } finally {
      setLoadingVerify(false);
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

          {step === 1 ? (
            <>
              <label className="block mb-2 text-sm">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full p-3 border rounded-lg mb-3"
              />

              <label className="block mb-2 text-sm">Email</label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg mb-4"
              />

              <button
                onClick={requestOtp}
                disabled={loadingSend}
                className={`w-full py-3 rounded-full btn-gradient text-white font-medium shadow-lg ${
                  loadingSend ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loadingSend ? "Sending OTP…" : "Send OTP"}
              </button>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-400">Have an account? </span>
                <Link href="/login" className="text-purple-600 font-medium">
                  Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <label className="block mb-2 text-sm">Enter OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg mb-3"
              />

              <label className="block mb-2 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
                placeholder="Choose a password"
              />

              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={verifyOtp}
                  disabled={loadingVerify}
                  className={`flex-1 py-3 rounded-full btn-gradient text-white font-medium shadow-md mr-3 ${
                    loadingVerify ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingVerify ? "Verifying…" : "Verify & Continue"}
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-lg border"
                >
                  Back
                </button>
              </div>
            </>
          )}

          <div className="flex justify-end mt-2">
            <Link href="/login" className="text-sm text-gray-500">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
