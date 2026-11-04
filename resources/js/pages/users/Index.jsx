import AppLayout from "@/layouts/AppLayout";
import UsersContent from "@/components/UsersContent";

export default function UsersIndex({ users, filters, options }) {
  return <UsersContent users={users} filters={filters} options={options} />;
}

UsersIndex.layout = AppLayout;
