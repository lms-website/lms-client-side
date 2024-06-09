import React from "react";
import {
  LuHome,
  LuUserCircle,
  LuFileText,
  LuLogOut,
  LuUsers2,
} from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logo/logo.png";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { updateAuth } from "../features/Auth/AuthSlice";
import { RxFileText } from "react-icons/rx";
import { TbLayoutGridFilled } from "react-icons/tb";
import { LuFileQuestion } from "react-icons/lu";
import { GrGroup } from "react-icons/gr";
import { MdNumbers } from "react-icons/md";
import { IoTodayOutline } from "react-icons/io5";
const sidebarItems = [
  {
    id: 0,
    link: "/home",
    icon: <LuHome size={20} className="icon" />,
    title: "Home",
  },
  {
    id: 1,
    link: "/users",
    icon: <LuUsers2 size={20} className="icon" />,
    title: "users",
  },
  {
    id: 2,
    link: "/exams",
    icon: <LuFileQuestion size={20} className="icon" />,
    title: "Exams",
    roleRestrict: "admin",
  },
  {
    id: 3,
    link: "/results",
    icon: <RxFileText size={20} className="icon" />,
    title: "Results",
    role: "admin,student",
    roleRestrict: "teacher",
  },
  {
    id: 4,
    link: "/class-level",
    icon: <TbLayoutGridFilled size={20} className="icon" />,
    title: "Class level",
    role: "admin,student",
    roleRestrict: "teacher",
  },
  {
    id: 5,
    link: "/programms",
    icon: <LuFileText size={20} className="icon" />,
    title: "Programmes",
    role: "teacher,admin",
    roleRestrict: "user",
  },
  {
    id: 6,
    link: "/Academic-year",
    icon: <MdNumbers size={20} className="icon" />,
    title: "Academic Year",
    role: "admin",
  },
  {
    id: 7,
    link: "/academic-terms",
    icon: <IoTodayOutline size={20} className="icon" />,
    title: "Academic Terms",
    role: "admin",
  },
  {
    id: 8,
    link: "/groups",
    icon: <GrGroup size={20} className="icon" />,
    title: "Groups",
    role: "admin",
  },
  {
    id: 9,
    link: "/profile",
    icon: <LuUserCircle size={20} className="icon" />,
    title: "profile",
  },
];
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((store) => store.auth);
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    dispatch(updateAuth(null));
    navigate("/", { replace: true });
  };
  const hasAccess = (item) => {
    if (item.roleRestrict && item.roleRestrict.split(",").includes(role)) {
      return false;
    }
    if (item.role && !item.role.split(",").includes(role)) {
      return false;
    }
    return true;
  };
  console.log(role, "k");
  return (
    <div className="w-[70px] md:w-[250px] bg-white h-screen overflow-y-auto py-4 px-3">
      <img src={Logo} alt="logo" className=" w-[40px] md:w-[85px] mb-5" />
      <ul className=" sidebar flex flex-col gap-2">
        {sidebarItems.map((item) =>
          hasAccess(item) ? (
            <li
              key={item.id}
              className="outline-none transition-all duration-300 ease-in-out rounded-lg"
            >
              <NavLink
                to={item.link}
                className="w-full flex py-3 rounded-lg px-3 items-center gap-2"
              >
                <span className="flex w-6 h-full transition-all duration-300 ease-in-out">
                  {item.icon}
                </span>
                <span className="hidden md:flex text-[18px] text-light-gray transition-all duration-300 ease-in-out sidebar_text">
                  {item.title}
                </span>
              </NavLink>
            </li>
          ) : null
        )}
        <li
          role="button"
          onClick={handleLogout}
          className="flex  transition-all duration-300 ease-in-out py-3 rounded-lg px-3 items-center gap-2"
        >
          <span className="flex w-6 h-full transition-all duration-300 ease-in-out">
            <LuLogOut className="icon" size={20} />
          </span>
          <span className="hidden md:flex text-[18px] text-light-gray transition-all duration-300 ease-in-out sidebar_text">
            Log out
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
