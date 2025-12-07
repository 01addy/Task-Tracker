import { useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const router = useRouter();

  // Request OTP for reset
  const requestOtp = async () => {
    if (!identifier) return toast.error("Enter email");

    try {
      setLoadingSend(true);

      await api.post("/api/auth/send-otp", {
        email: identifier,
        purpose: "reset",
      });

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (e) {
      console.error("requestOtp (reset) error:", e);
      toast.error(e?.response?.data?.error || "Unable to send OTP");
    } finally {
      setLoadingSend(false);
    }
  };

  // Verify OTP + reset password
  const resetPassword = async () => {
    if (!otp || !newPassword)
      return toast.error("Enter OTP and new password");

    try {
      setLoadingVerify(true);

      await api.post("/api/auth/verify-otp", {
        email: identifier,
        otp,
        purpose: "reset",
        password: newPassword,
      });

      toast.success("Password reset successfully. Please login.");
      router.replace("/login");
    } catch (e) {
      console.error("resetPassword error:", e);
      toast.error(e?.response?.data?.error || "Reset failed");
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
            Reset password
          </h3>
          <p className="text-center text-sm text-gray-500 mb-6">
            Enter your email to reset your password
          </p>

          {step === 1 ? (
            <>
              <label className="block mb-2 text-sm">Email</label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg mb-3"
              />

              <div className="flex gap-3">
                <button
                  onClick={requestOtp}
                  disabled={loadingSend}
                  className={`flex-1 py-3 rounded-full btn-gradient text-white font-medium shadow-lg ${
                    loadingSend ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingSend ? "Sending OTP…" : "Send OTP"}
                </button>

                <Link href="/login" className="px-4 py-3 rounded-lg border">
                  Back
                </Link>
              </div>
            </>
          ) : (
            <>
              <label className="block mb-2 text-sm">OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg mb-3"
              />

              <label className="block mb-2 text-sm">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full p-3 border rounded-lg mb-3"
              />

              <div className="flex gap-3">
                <button
                  onClick={resetPassword}
                  disabled={loadingVerify}
                  className={`flex-1 py-3 rounded-full btn-gradient text-white font-medium shadow-md ${
                    loadingVerify ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingVerify ? "Resetting…" : "Reset Password"}
                </button>

                <Link href="/login" className="px-4 py-3 rounded-lg border">
                  Cancel
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
