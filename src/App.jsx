import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";
import UsersContent from "./components/UsersContent";
import { useSelector } from "react-redux";

function App() {
  const activeItem = useSelector((state) => state.navigation.activeItem);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="min-w-0 flex-1">
        {activeItem === "Users" ? (
          <UsersContent />
        ) : (
          <DashboardContent activeTab={activeItem} />
        )}
      </main>
    </div>
  );
}

export default App;
