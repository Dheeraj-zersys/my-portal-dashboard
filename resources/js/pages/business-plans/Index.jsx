import AppLayout from "@/layouts/AppLayout";
import BusinessPlanContent from "@/components/BusinessPlanContent";

// UI renders mock data. TODO(frontend): use the props below instead.
// Props: plans, filters, options
export default function BusinessPlansIndex() {
  return <BusinessPlanContent />;
}

BusinessPlansIndex.layout = AppLayout;
