import MasterDataContent from "./MasterDataContent";

const initialManagers = [
  {
    id: 1,
    name: "RMD",
    state: "Karnataka",
    districts: ["Banglore"],
    status: "Active",
    createdDate: "10/10/2026",
  },
  {
    id: 2,
    name: "KP",
    state: "Tamil nadu",
    districts: ["Kanchipuram"],
    status: "Active",
    createdDate: "12/10/2026",
  },
  {
    id: 3,
    name: "LD",
    state: "Andhra Pradesh",
    districts: ["Kurnool"],
    status: "Active",
    createdDate: "11/10/2026",
  },
  {
    id: 4,
    name: "CHK",
    state: "Andhra Pradesh",
    districts: ["Tirupati"],
    status: "Active",
    createdDate: "9/10/2026",
  },
  {
    id: 5,
    name: "AGP",
    state: "Karnataka",
    districts: ["Kolar"],
    status: "Active",
    createdDate: "14/10/2026",
  },
];

const GAManagerContent = () => (
  <MasterDataContent
    key={JSON.stringify(initialManagers)}
    managerType="ga"
    initialManagers={initialManagers}
  />
);

export default GAManagerContent;
