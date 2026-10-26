import AppLayout from "@/layouts/AppLayout";
import DailyProgressReport from "@/components/DailyProgress";

// UI renders mock data. TODO(frontend): use the props below instead.
// Props: reports, filters
export default function DailyProgressReportsIndex() {
  return <DailyProgressReport />;
}

DailyProgressReportsIndex.layout = AppLayout;
