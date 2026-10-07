import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Changed <Dashboard /> to <DashboardContent /> to match the import above */}
      <DashboardContent />
      <main className="flex-1 p-6" />
    </div>
  );
}

export default App;
