import AppLayout from "@/layouts/AppLayout";
import GAManagerContent from "@/components/MasterData/GAManagerContent";

// UI renders mock data. TODO(frontend): use the props below instead.
// Props: managers, filters, options
export default function GeographicalAreas() {
  return <GAManagerContent />;
}

GeographicalAreas.layout = AppLayout;
