import React from "react";
import { useSelector } from "react-redux";
import { LuUser2 } from "react-icons/lu";
const Header = () => {
  const { avatar, full_name } = useSelector((store) => store.auth);

  return (
    <div className="bg-white flex justify-between items-center gap-4 w-full rounded-xl py-4 px-4 h-[90px] shadow shadow-sm">
      <span className="text-xl text-dark-gray font-bold ">
        Welcome, {full_name}
      </span>
      {avatar ? (
        <img src={avatar} alt="avatar" />
      ) : (
        <span className="flex w-14 h-14 bg-primary rounded-full items-center justify-center">
          <LuUser2 size={25} color="#FFF" />
        </span>
      )}
    </div>
  );
};

export default Header;
