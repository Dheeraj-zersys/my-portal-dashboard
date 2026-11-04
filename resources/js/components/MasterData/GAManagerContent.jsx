import MasterDataContent from "./MasterDataContent";

const GAManagerContent = ({ managers, filters, options }) => (
  <MasterDataContent
    managerType="ga"
    managers={managers}
    filters={filters}
    options={options}
    showSearch
  />
);

export default GAManagerContent;
