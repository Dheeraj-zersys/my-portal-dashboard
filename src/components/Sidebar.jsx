import { useSelector, useDispatch } from "react-redux";
import {
  setActiveItem,
  toggleMasterData,
} from "../features/navigation/navigationSlice";
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiFileText } from "react-icons/fi";
import { MdFormatListBulleted } from "react-icons/md";
import { TbGlobe } from "react-icons/tb";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import "./Sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeItem, isMasterDataOpen } = useSelector(
    (state) => state.navigation,
  );

  const navItems = [
    { name: "Dashboard", icon: <RxDashboard /> },
    { name: "Users", icon: <FiUsers /> },
    { name: "Business Plan", icon: <MdFormatListBulleted /> },
    { name: "Daily Progress Report", icon: <FiFileText /> },
  ];

  const subItems = ["GA Manager", "BU Manager"];

  return (
    <aside className="sidebar">
      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${activeItem === item.name ? "active" : ""}`}
            onClick={() => dispatch(setActiveItem(item.name))}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </button>
        ))}

        {/* Master Data Dropdown */}
        <div className="nav-dropdown">
          <button
            className={`nav-item ${activeItem.includes("Manager") ? "active" : ""}`}
            onClick={() => dispatch(toggleMasterData())}
          >
            <span className="nav-icon">
              <TbGlobe />
            </span>
            <span className="nav-label">Master Data</span>
            <span className="arrow-icon">
              {isMasterDataOpen ? <GoTriangleUp /> : <GoTriangleDown />}
            </span>
          </button>

          {isMasterDataOpen && (
            <div className="sub-menu">
              {subItems.map((sub) => (
                <button
                  key={sub}
                  className={`nav-item sub-item ${activeItem === sub ? "active" : ""}`}
                  onClick={() => dispatch(setActiveItem(sub))}
                >
                  <span className="bullet-point">•</span>
                  <span className="nav-label">{sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
