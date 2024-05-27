import React from "react";
import {
  LuHome,
  LuUserCircle,
  LuFileText,
  LuLogOut,
  LuUsers2,
} from "react-icons/lu";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/logo.png";
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
    icon: <LuFileText size={20} className="icon" />,
    title: "Exams",
  },
  {
    id: 3,
    link: "/profile",
    icon: <LuUserCircle size={20} className="icon" />,
    title: "profile",
  },
];
const Sidebar = () => {
  return (
    <div className="w-[70px] md:w-[250px] bg-white h-screen overflow-y-auto py-4 px-3">
      <img src={Logo} alt="logo" className=" w-[40px] md:w-[85px] mb-5" />
      <ul className=" sidebar flex flex-col gap-2">
        {sidebarItems?.map((item) => (
          <li
            key={item.id}
            className="outline-none  transition-all duration-300 ease-in-out rounded-lg"
          >
            <NavLink
              to={item?.link}
              className="w-full flex py-3 rounded-lg px-3 items-center gap-2"
            >
              <span className="flex w-6 h-full transition-all duration-300 ease-in-out">
                {item?.icon}
              </span>
              <span className="hidden md:flex text-[18px] text-light-grey transition-all duration-300 ease-in-out sidebar_text">
                {item?.title}
              </span>
            </NavLink>
          </li>
        ))}
        <li
          role="button"
          className="flex  transition-all duration-300 ease-in-out py-3 rounded-lg px-3 items-center gap-2"
        >
          <span className="flex w-6 h-full transition-all duration-300 ease-in-out">
            <LuLogOut className="icon" size={20} />
          </span>
          <span className="hidden md:flex text-[18px] text-light-grey transition-all duration-300 ease-in-out sidebar_text">
            Log out
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
