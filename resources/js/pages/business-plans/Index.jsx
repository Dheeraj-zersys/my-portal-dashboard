import AppLayout from "@/layouts/AppLayout";
import BusinessPlanContent from "@/components/BusinessPlanContent";

export default function BusinessPlansIndex({ plans, filters, options }) {
  return <BusinessPlanContent plans={plans} filters={filters} options={options} />;
}

BusinessPlansIndex.layout = AppLayout;
