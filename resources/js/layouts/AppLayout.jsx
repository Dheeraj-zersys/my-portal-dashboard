import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Bell, LogOut, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  const { auth } = usePage().props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const displayName = auth.user?.name ?? "";

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
                      {auth.user?.email}
                    </p>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs text-[#11733f] border border-[#11733f] rounded-full font-medium">
                      {auth.user?.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.post("/logout")}
                  className="w-full mt-3 flex items-center gap-2.5 text-left font-medium text-sm text-gray-400 hover:text-gray-900 py-2 rounded transition"
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
        <main className="flex min-w-4 flex-1 flex-col">{children}</main>
      </div>
      <footer className="shrink-0 border-t border-gray-400 bg-white px-6 py-6 text-center text-xs text-gray-500">
        v0.1.0 2025 TG Portal. All Rights Reserved
      </footer>
    </div>
  );
}
