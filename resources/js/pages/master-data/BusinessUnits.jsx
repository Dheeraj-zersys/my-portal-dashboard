import AppLayout from "@/layouts/AppLayout";
import BUManagerContent from "@/components/MasterData/BUManagerContent";

// UI renders mock data. TODO(frontend): use the props below instead.
// Props: managers, filters, options
export default function BusinessUnits() {
  return <BUManagerContent />;
}

BusinessUnits.layout = AppLayout;
