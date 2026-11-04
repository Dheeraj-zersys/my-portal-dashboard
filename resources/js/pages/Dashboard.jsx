import AppLayout from "@/layouts/AppLayout";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard({ stats }) {
  return <DashboardContent stats={stats} />;
}

Dashboard.layout = AppLayout;
