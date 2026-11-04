import MasterDataContent from "./MasterDataContent";

const BUManagerContent = ({ managers, filters, options }) => (
  <MasterDataContent
    managerType="bu"
    managers={managers}
    filters={filters}
    options={options}
    showSearch
  />
);

export default BUManagerContent;
