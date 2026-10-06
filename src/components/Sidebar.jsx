import { useSelector, useDispatch } from "react-redux";
import {
  setActiveItem,
  toggleMasterData,
} from "../features/navigation/navigationSlice";
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiFileText } from "react-icons/fi";
import { MdFormatListBulleted } from "react-icons/md";
import { TbGlobe } from "react-icons/tb";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

const navItems = [
  ["Dashboard", RxDashboard],
  ["Users", FiUsers],
  ["Business Plan", MdFormatListBulleted],
  ["Daily Progress Report", FiFileText],
];
const subItems = ["GA Manager", "BU Manager"];
const itemStyle =
  "flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-[20px] font-medium text-[#1a1a1a] transition-colors hover:bg-[#ededef] focus-visible:outline-2 focus-visible:outline-orange-500";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeItem, isMasterDataOpen } = useSelector(
    (state) => state.navigation,
  );
  const selectItem = (item) => dispatch(setActiveItem(item));

  return (
    <aside className="min-h-screen w-[280px] shrink-0 border-r border-[#e5e5e5] bg-[#f7f7f8] p-4">
      <nav className="flex flex-col gap-2">
        {navItems.map(([name, Icon]) => (
          <button
            key={name}
            className={`${itemStyle} ${activeItem === name ? "bg-[#ffefe5] text-[#f96200]" : ""}`}
            onClick={() => selectItem(name)}
          >
            <Icon className="shrink-0 text-2xl" />
            <span className="flex-1">{name}</span>
          </button>
        ))}

        <button
          className={`${itemStyle} ${activeItem.includes("Manager") ? "bg-[#ffefe5] text-[#f96200]" : ""}`}
          onClick={() => dispatch(toggleMasterData())}
          aria-expanded={isMasterDataOpen}
        >
          <TbGlobe className="shrink-0 text-2xl" />
          <span className="flex-1">Master Data</span>
          {isMasterDataOpen ? <GoChevronUp /> : <GoChevronDown />}
        </button>
        {isMasterDataOpen && (
          <div className="flex flex-col gap-2 pl-8">
            {subItems.map((item) => (
              <button
                key={item}
                className={`${itemStyle} ${activeItem === item ? "bg-[#ffefe5] text-[#f96200]" : ""}`}
                onClick={() => selectItem(item)}
              >
                <span aria-hidden="true">•</span>
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
