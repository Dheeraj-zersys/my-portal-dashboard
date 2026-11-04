import AppLayout from "@/layouts/AppLayout";
import DailyProgressReport from "@/components/DailyProgress";

export default function DailyProgressReportsIndex({ reports, filters }) {
  return (
    <DailyProgressReport
      screen="index"
      reports={reports}
      filters={filters}
    />
  );
}

DailyProgressReportsIndex.layout = AppLayout;
