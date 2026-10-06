import React from "react";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ padding: "24px", flexGrow: 1 }}>
        <h1>Main Content Area</h1>
      </main>
    </div>
  );
}

export default App;
