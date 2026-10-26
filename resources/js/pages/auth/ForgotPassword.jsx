import { Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";

export default function ForgotPassword({ status }) {
  const form = useForm({ email: "" });

  const submit = (e) => {
    e.preventDefault();
    form.post("/forgot-password");
  };

  return (
    <AuthLayout>
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="TG Portal" className="h-auto w-60" />
      </div>
      <h2 className="text-center text-3xl font-bold text-gray-800 tracking-wide mb-6">
        Reset Password
      </h2>

      {status ? (
        <p className="text-center text-sm text-gray-600" role="status">
          {status}
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Your Email Address"
            aria-label="Email address"
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            required
            className="w-full px-4 py-2.5 border-gray-100 border-none bg-gray-100 rounded-md text-sm outline-none placeholder-gray-400 placeholder:text-gray-800"
          />
          {form.errors.email && (
            <p className="text-xs text-red-600" role="alert">
              {form.errors.email}
            </p>
          )}
          <button
            type="submit"
            disabled={form.processing}
            className="w-full py-2 bg-[#00875A] hover:bg-[#00704a] text-white font-medium rounded text-sm transition disabled:opacity-60"
          >
            Continue
          </button>
        </form>
      )}

      <div className="mt-6 border-t border-black/20" />
      <Link
        href="/login"
        className="block w-full mt-4 text-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        ← Back to Login
      </Link>
    </AuthLayout>
  );
}
