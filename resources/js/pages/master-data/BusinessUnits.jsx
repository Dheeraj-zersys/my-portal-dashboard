import AppLayout from "@/layouts/AppLayout";
import BUManagerContent from "@/components/MasterData/BUManagerContent";

export default function BusinessUnits({ managers, filters, options }) {
  return <BUManagerContent managers={managers} filters={filters} options={options} />;
}

BusinessUnits.layout = AppLayout;
