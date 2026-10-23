import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";
import UsersContent from "./components/UsersContent";
import BusinessPlanContent from "./components/BusinessPlanContent";
import GAManagerContent from "./components/MasterData/GAManagerContent";
import BUManagerContent from "./components/MasterData/BUManagerContent";
import DailyProgressReport from "./components/DailyProgress";
import { useSelector } from "react-redux";
import { Bell, LogOut, Menu } from "lucide-react";
import { BiBellPlus } from "react-icons/bi";

function DashboardApp({ email, setIsLoggedIn }) {
  const activeItem = useSelector((state) => state.navigation.activeItem);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const rawName = email ? email.split("@")[0] : "Example";
  const displayName =
    rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-orange-500"
            onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
          >
            <Menu size={20} />
          </button>
          <img src="/think-gas-logo.png" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-4 relative">
          <button
            type="button"
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-orange-500"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-gray-100 transition focus:outline-none"
              aria-expanded={isUserMenuOpen}
            >
              <div className="h-8 w-8 rounded-full bg-[#11733f] text-white flex items-center justify-center font-semibold text-sm">
                {displayName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-800">
                {displayName}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-4 px-5 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-[#11733f] text-white flex items-center justify-center font-bold text-base">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base leading-tight">
                      {displayName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {email || "xyz@example.com"}
                    </p>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs text-[#11733f] border border-[#11733f] rounded-full font-medium">
                      Super Admin
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full mt-3 flex items-center gap-2.5 text-left text-sm text-gray-700 hover:text-gray-900 py-2 rounded transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {isSidebarOpen && <Sidebar />}
        <main className="flex min-w-4 flex-1 flex-col">
          {activeItem === "Users" ? (
            <UsersContent />
          ) : activeItem === "Business Plan" ? (
            <BusinessPlanContent />
          ) : activeItem === "GA Manager" ? (
            <GAManagerContent />
          ) : activeItem === "BU Manager" ? (
            <BUManagerContent />
          ) : activeItem === "Daily Progress Report" ? (
            <DailyProgressReport />
          ) : (
            <DashboardContent activeTab={activeItem} />
          )}
        </main>
      </div>
      <footer className="shrink-0 border-t border-gray-400 bg-white px-6 py-6 text-center text-xs text-gray-500">
        v0.1.0 2025 TG Portal. All Rights Reserved
      </footer>
    </div>
  );
}

// Login & Dashboard transition ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [page, setPage] = useState("login");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  if (isLoggedIn) {
    return <DashboardApp email={email} setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-end pr-12 bg-gray-900">
      {/* Background Gas Station Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/public/gas-station.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Login Card */}
      <div
        className={`relative w-full ${
          page === "set-password" ? "max-w-sm p-6" : "max-w-md p-10"
        } bg-white rounded-md mr-10 mb-2 shadow-xl`}
      >
        {page === "reset" ? (
          <>
            <div className="flex justify-center mb-6">
              <img
                src="/public/logo.png"
                alt="TG Portal"
                className="h-auto w-60"
              />
            </div>
            <h2 className="text-center text-3xl font-bold text-gray-800 tracking-wide mb-6">
              Reset Password
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage("set-password");
              }}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Enter Your Email Address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border-gray-100 border-none bg-gray-100 rounded-md text-sm outline-none placeholder-gray-400 placeholder:text-gray-800"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#00875A] hover:bg-[#00704a] text-white font-medium rounded text-sm transition"
              >
                Continue
              </button>
            </form>

            <div className="mt-6 border-t border-black/20" />
            <button
              type="button"
              onClick={() => {
                setPage("login");
                setResetPassword("");
                setConfirmPassword("");
                setResetError("");
              }}
              className="w-full mt-4 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              ← Back to Login
            </button>
          </>
        ) : page === "set-password" ? (
          <>
            <div className="flex justify-center mb-5">
              <img
                src="/public/logo.png"
                alt="TG Portal"
                className="h-auto w-40"
              />
            </div>
            <h2 className="text-center text-xl font-bold text-gray-800">
              Reset Password
            </h2>
            <p className="text-center text-xs text-gray-600 mt-1 mb-4">
              Reset your password using the form below
            </p>

            {resetComplete ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-600" role="status">
                  Your password has been reset.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPage("login");
                    setResetPassword("");
                    setConfirmPassword("");
                    setResetComplete(false);
                  }}
                  className="w-full py-2 bg-[#00875A] hover:bg-[#00704a] text-white font-medium rounded text-sm transition"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (resetPassword !== confirmPassword) {
                    setResetError("Passwords do not match.");
                    return;
                  }
                  setResetError("");
                  setResetComplete(true);
                }}
                className="space-y-3"
              >
                <label className="block text-xs text-gray-800">
                  Enter Your Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={resetPassword}
                      onChange={(e) => {
                        setResetPassword(e.target.value);
                        setResetError("");
                      }}
                      required
                      className="w-full px-3 py-2.5 pr-10 bg-gray-100 rounded-md text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      aria-label={
                        showResetPassword ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-gray-800"
                    >
                      {!showResetPassword ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.3M6.2 6.2C4.3 7.4 3 9.4 2.5 12c.8 2.1 2.8 4.6 6 6.1a9.6 9.6 0 003.5.9c1 0 1.9-.2 2.8-.5" />
                        </svg>
                      ) : (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                      )}
                    </button>
                  </span>
                </label>

                <label className="block text-xs text-gray-800">
                  Confirm Password
                  <span className="relative mt-2 block">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter New Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setResetError("");
                      }}
                      required
                      className="w-full px-3 py-2.5 pr-10 bg-gray-100 rounded-md text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-gray-800"
                    >
                      {!showConfirmPassword ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.3M6.2 6.2C4.3 7.4 3 9.4 2.5 12c.8 2.1 2.8 4.6 6 6.1a9.6 9.6 0 003.5.9c1 0 1.9-.2 2.8-.5" />
                        </svg>
                      ) : (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                      )}
                    </button>
                  </span>
                </label>

                {resetError && (
                  <p className="text-xs text-red-600" role="alert">
                    {resetError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#11733f] hover:bg-[#0d5f34] text-white font-medium rounded text-xs transition"
                >
                  Reset Password
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <img
                src="/public/logo.png"
                alt="TG Portal"
                className="h-auto w-60"
              />
            </div>
            <h2 className="text-center text-3xl font-bold text-gray-800 tracking-wide mb-6">
              Login
            </h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border-gray-100 border-none bg-gray-100 rounded-md text-sm outline-none placeholder-gray-400 placeholder:text-gray-800"
                />
              </div>

              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border-gray-100 border-none bg-gray-100 rounded-md text-sm outline-none placeholder-gray-400 placeholder:text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={
                    showLoginPassword
                      ? "Hide login password"
                      : "Show login password"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-800"
                >
                  {!showLoginPassword ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.3M6.2 6.2C4.3 7.4 3 9.4 2.5 12c.8 2.1 2.8 4.6 6 6.1a9.6 9.6 0 003.5.9c1 0 1.9-.2 2.8-.5" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsLoggedIn(true)}
                className="w-full py-2 bg-[#00875A] hover:bg-[#00704a] text-white font-medium rounded text-sm transition"
              >
                Login
              </button>

              <div className="flex items-center justify-between pt-1 text-xs text-gray-600">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember Password</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setPage("reset");
                    setResetError("");
                  }}
                  className="hover:text-gray-800 transition-colors"
                >
                  Forgot Password
                </button>
              </div>

              <div className="mb-4 pb-2 border-t border-black/40" />
              <button
                type="button"
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-[#E65100] hover:bg-[#cc4700] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
              >
                LogIn With Office 365
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
