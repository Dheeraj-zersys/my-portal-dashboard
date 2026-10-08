import MasterDataContent from "./MasterDataContent";

const initialManagers = [
  { id: 1, name: "BU 1", status: "Active", createdDate: "12/06/2025" },
  { id: 2, name: "BU 2", status: "Active", createdDate: "12/06/2025" },
  { id: 3, name: "BU 3", status: "Active", createdDate: "13/06/2025" },
  { id: 4, name: "BU 4", status: "Active", createdDate: "13/06/2025" },
  { id: 5, name: "BU 5", status: "Active", createdDate: "14/06/2025" },
];

const BUManagerContent = () => (
  <MasterDataContent
    managerType="bu"
    initialManagers={initialManagers}
    showSearch
  />
);

export default BUManagerContent;
