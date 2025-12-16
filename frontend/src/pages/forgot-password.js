import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="auth-backdrop">
      <div className="bg-sides" aria-hidden>
        <div className="bg-left" />
        <div className="bg-right" />
      </div>

      <div className="auth-card">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">
            Password reset unavailable
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Password reset via email is currently disabled.
            <br />
            Please create a new account or contact the administrator.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full btn-gradient text-white font-medium shadow-lg"
            >
              Create new account
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 rounded-full border text-gray-700 dark:text-gray-200"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
