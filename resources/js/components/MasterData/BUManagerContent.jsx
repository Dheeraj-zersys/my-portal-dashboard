import MasterDataContent from "./MasterDataContent";

const initialManagers = [
  { id: 1, name: "BU 1", status: "Active", createdDate: "9/10/2026" },
  { id: 2, name: "BU 2", status: "Active", createdDate: "9/10/2026" },
  { id: 3, name: "BU 3", status: "Active", createdDate: "9/10/2026" },
  { id: 4, name: "BU 4", status: "Active", createdDate: "9/10/2026" },
  { id: 5, name: "BU 5", status: "Active", createdDate: "8/10/2026" },
];
const BUManagerContent = () => (
  <MasterDataContent
    key={JSON.stringify(initialManagers)}
    managerType="bu"
    initialManagers={initialManagers}
    showSearch
  />
);

export default BUManagerContent;
