import { useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";
import PasswordVisibilityIcon from "@/components/PasswordVisibilityIcon";

export default function ResetPassword({ token, email }) {
  const form = useForm({
    token,
    email: email ?? "",
    password: "",
    password_confirmation: "",
  });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (form.data.password !== form.data.password_confirmation) {
      form.setError("password", "Passwords do not match.");
      return;
    }
    form.post("/reset-password", {
      onFinish: () => form.reset("password", "password_confirmation"),
    });
  };

  const error = form.errors.email || form.errors.password || form.errors.token;

  return (
    <AuthLayout compact>
      <div className="flex justify-center mb-5">
        <img src="/logo.png" alt="TG Portal" className="h-auto w-40" />
      </div>
      <h2 className="text-center text-xl font-bold text-gray-800">
        Reset Password
      </h2>
      <p className="text-center text-xs text-gray-600 mt-1 mb-4">
        Reset your password using the form below
      </p>

      <form onSubmit={submit} className="space-y-3">
        <label className="block text-xs text-gray-800">
          Enter Your Email Address
          <input
            type="email"
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            required
            className="mt-2 w-full px-3 py-2.5 bg-gray-100 rounded-md text-xs outline-none"
          />
        </label>

        <label className="block text-xs text-gray-800">
          Password
          <span className="relative mt-2 block">
            <input
              type={showResetPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={form.data.password}
              onChange={(e) => {
                form.setData("password", e.target.value);
                form.clearErrors("password");
              }}
              required
              className="w-full px-3 py-2.5 pr-10 bg-gray-100 rounded-md text-xs outline-none"
            />
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              aria-label={showResetPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-800"
            >
              <PasswordVisibilityIcon visible={showResetPassword} />
            </button>
          </span>
        </label>

        <label className="block text-xs text-gray-800">
          Confirm Password
          <span className="relative mt-2 block">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter New Password"
              value={form.data.password_confirmation}
              onChange={(e) => {
                form.setData("password_confirmation", e.target.value);
                form.clearErrors("password");
              }}
              required
              className="w-full px-3 py-2.5 pr-10 bg-gray-100 rounded-md text-xs outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-800"
            >
              <PasswordVisibilityIcon visible={showConfirmPassword} />
            </button>
          </span>
        </label>

        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={form.processing}
          className="w-full py-2.5 bg-[#11733f] hover:bg-[#0d5f34] text-white font-medium rounded text-xs transition disabled:opacity-60"
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}
