import AppLayout from "@/layouts/AppLayout";
import UsersContent from "@/components/UsersContent";

// UI renders mock data. TODO(frontend): use the props below instead.
// Props: users, filters, options
export default function UsersIndex() {
  return <UsersContent />;
}

UsersIndex.layout = AppLayout;
