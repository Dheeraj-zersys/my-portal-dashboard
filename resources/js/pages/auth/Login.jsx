import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";
import PasswordVisibilityIcon from "@/components/PasswordVisibilityIcon";

export default function Login({ status }) {
  const form = useForm({ email: "", password: "", rememberMe: false });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const submitLogin = (e) => {
    e.preventDefault();
    form.post("/login", { onFinish: () => form.reset("password") });
  };

  return (
    <AuthLayout>
      <div className="flex justify-center mb-4">
        <img src="/logo.png" alt="TG Portal" className="h-auto w-60" />
      </div>
      <h2 className="text-center text-3xl font-bold text-gray-800 tracking-wide mb-6">
        Login
      </h2>

      {status && (
        <p className="mb-4 text-center text-sm text-[#11733f]" role="status">
          {status}
        </p>
      )}

      <form onSubmit={submitLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            required
            className="w-full px-4 py-2.5 border-gray-100 border-none bg-gray-100 rounded-md text-sm outline-none placeholder-gray-400 placeholder:text-gray-800"
          />
        </div>

        <div className="relative">
          <input
            type={showLoginPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={form.data.password}
            onChange={(e) => form.setData("password", e.target.value)}
            required
            className="w-full px-4 py-2.5 pr-10 border-gray-100 border-none bg-gray-100 rounded-md text-sm outline-none placeholder-gray-400 placeholder:text-gray-800"
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
            aria-label={
              showLoginPassword ? "Hide login password" : "Show login password"
            }
            className="absolute inset-y-0 right-3 flex items-center text-gray-800"
          >
            <PasswordVisibilityIcon visible={showLoginPassword} />
          </button>
        </div>

        {(form.errors.email || form.errors.password) && (
          <p className="text-xs text-red-600" role="alert">
            {form.errors.email || form.errors.password}
          </p>
        )}

        <button
          type="submit"
          disabled={form.processing}
          className="w-full py-2 bg-[#00875A] hover:bg-[#00704a] text-white font-medium rounded text-sm transition disabled:opacity-60"
        >
          Login
        </button>

        <div className="flex items-center justify-between pt-1 text-xs text-gray-600">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.data.rememberMe}
              onChange={(e) => form.setData("rememberMe", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Remember Password</span>
          </label>

          <Link
            href="/forgot-password"
            className="hover:text-gray-800 transition-colors"
          >
            Forgot Password
          </Link>
        </div>

        <div className="mb-4 pb-2 border-t border-black/40" />
        {/* TODO: Office 365 sign-in has no backend yet. */}
        <button
          type="button"
          className="w-full bg-[#E65100] hover:bg-[#cc4700] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
        >
          LogIn With Office 365
        </button>
      </form>
    </AuthLayout>
  );
}
