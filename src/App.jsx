import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";
import UsersContent from "./components/UsersContent";
import { useSelector } from "react-redux";

function App() {
  const activeItem = useSelector((state) => state.navigation.activeItem);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-6">
          <img
            src="/think-gas-logo.png"
            alt="Think Gas"
            className="h-6 w-auto"
          />
        </header>
        <main className="flex min-h-0 flex-1 flex-col">
          {activeItem === "Users" ? (
            <UsersContent />
          ) : (
            <DashboardContent activeTab={activeItem} />
          )}
        </main>
        <footer className="shrink-0 border-t border-gray-200 bg-white px-6 py-4 text-center text-xs text-gray-500">
          v0.1.0 © 2025 TG Portal. All Right Reserved
        </footer>
      </div>
    </div>
  );
}

export default App;
