import MasterDataContent from "./MasterDataContent";

const initialManagers = [
  {
    id: 1,
    name: "Anantapur",
    state: "Andhra Pradesh",
    districts: ["Anantapur", "Kurnool"],
    status: "Active",
    createdDate: "12/06/2025",
  },
  {
    id: 2,
    name: "Kakinada",
    state: "Andhra Pradesh",
    districts: ["East Godavari", "West Godavari"],
    status: "Active",
    createdDate: "12/06/2025",
  },
  {
    id: 3,
    name: "Vijayawada",
    state: "Andhra Pradesh",
    districts: ["NTR", "Guntur"],
    status: "Active",
    createdDate: "13/06/2025",
  },
  {
    id: 4,
    name: "Tirupati",
    state: "Andhra Pradesh",
    districts: ["Tirupati", "Chittoor"],
    status: "Active",
    createdDate: "13/06/2025",
  },
  {
    id: 5,
    name: "Hyderabad",
    state: "Telangana",
    districts: ["Hyderabad", "Rangareddy"],
    status: "Active",
    createdDate: "14/06/2025",
  },
];

const GAManagerContent = () => (
  <MasterDataContent managerType="ga" initialManagers={initialManagers} />
);

export default GAManagerContent;
