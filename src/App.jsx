import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";
import UsersContent from "./components/UsersContent";
import BusinessPlanContent from "./components/BusinessPlanContent";
import GAManagerContent from "./components/MasterData/GAManagerContent";
import BUManagerContent from "./components/MasterData/BUManagerContent";
// import DailyProgressReport from "./components/DailyProgressReport";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Bell, Menu } from "lucide-react";

function App() {
  const activeItem = useSelector((state) => state.navigation.activeItem);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <Menu size={19} />
          </button>
          <img
            src="/think-gas-logo.png"
            alt="Think Gas"
            className="h-7 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="p-2 text-gray-500" aria-hidden="true">
            <Bell size={17} />
          </span>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {isSidebarOpen && <Sidebar />}
        <main className="flex min-w-0 flex-1 flex-col">
          {activeItem === "Users" ? (
            <UsersContent />
          ) : activeItem === "Business Plan" ? (
            <BusinessPlanContent />
          ) : activeItem === "GA Manager" ? (
            <GAManagerContent />
          ) : activeItem === "BU Manager" ? (
            <BUManagerContent />
          ) : (
            <DashboardContent activeTab={activeItem} />
          )}
        </main>
      </div>
      <footer className="shrink-0 border-t border-gray-200 bg-white px-6 py-3 text-center text-xs text-gray-500">
        v0.1.0 2025 TG Portal. All Rights Reserved
      </footer>
    </div>
  );
}

export default App;
