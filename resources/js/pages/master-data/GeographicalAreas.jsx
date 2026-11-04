import AppLayout from "@/layouts/AppLayout";
import GAManagerContent from "@/components/MasterData/GAManagerContent";

export default function GeographicalAreas({ managers, filters, options }) {
  return <GAManagerContent managers={managers} filters={filters} options={options} />;
}

GeographicalAreas.layout = AppLayout;
