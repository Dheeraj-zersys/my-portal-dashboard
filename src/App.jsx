import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6" />
    </div>
  );
}

export default App;
