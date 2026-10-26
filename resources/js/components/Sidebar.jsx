import { useSelector, useDispatch } from "react-redux";
import { Link, usePage } from "@inertiajs/react";
import { toggleMasterData } from "../features/navigation/navigationSlice";

import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiFileText } from "react-icons/fi";
import { MdFormatListBulleted } from "react-icons/md";
import { TbGlobe } from "react-icons/tb";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

const navItems = [
  ["Dashboard", RxDashboard, "/dashboard"],
  ["Users", FiUsers, "/users"],
  ["Business Plan", MdFormatListBulleted, "/business-plans"],
  ["Daily Progress Report", FiFileText, "/daily-progress-reports"],
];
const subItems = [
  ["GA Manager", "/master-data/geographical-areas"],
  ["BU Manager", "/master-data/business-units"],
];
const itemStyle =
  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-md font-medium text-[#1a1a1a] transition-colors hover:bg-[#ededef] focus-visible:outline-2 focus-visible:outline-orange-500";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isMasterDataOpen } = useSelector((state) => state.navigation);
  const { url } = usePage();
  const isActive = (href) => url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`);

  return (
    <aside
      id="app-sidebar"
      className="w-56 shrink-0 border-r border-[#e5e5e5] bg-white p-3"
    >
      <nav className="flex flex-col gap-2">
        {navItems.map(([name, Icon, href]) => (
          <Link
            key={name}
            href={href}
            className={`${itemStyle} ${isActive(href) ? "bg-[#ffefe5] text-[#f96200]" : ""}`}
          >
            <Icon className="shrink-0 text-xl" />
            <span className="flex-1">{name}</span>
          </Link>
        ))}

        <button
          className={`${itemStyle} ${isActive("/master-data") ? "bg-[#ffefe5] text-[#f96200]" : ""}`}
          onClick={() => dispatch(toggleMasterData())}
          aria-expanded={isMasterDataOpen}
        >
          <TbGlobe className="shrink-0 text-xl" />
          <span className="flex-1">Master Data</span>
          {isMasterDataOpen ? <GoChevronUp /> : <GoChevronDown />}
        </button>
        {isMasterDataOpen && (
          <div className="flex flex-col gap-1 pl-6">
            {subItems.map(([item, href]) => (
              <Link
                key={item}
                href={href}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors hover:bg-[#ededef] focus-visible:outline-2 focus-visible:outline-orange-500 ${isActive(href) ? "text-[#f96200]" : "text-[#1a1a1a]"}`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <span aria-hidden="true">•</span>
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
