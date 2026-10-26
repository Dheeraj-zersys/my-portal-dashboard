import AppLayout from "@/layouts/AppLayout";
import DashboardContent from "@/components/DashboardContent";

// UI renders mock data. TODO(frontend): use the props below instead.
// Props: stats
export default function Dashboard() {
  return <DashboardContent />;
}

Dashboard.layout = AppLayout;
