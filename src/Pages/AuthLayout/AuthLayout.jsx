import React from "react";
import Sidebar from "../../Ui/Sidebar";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className=" h-screen bg-body flex gap-4">
      <Sidebar />
      <div className="h-full  flex-1 overflow-y-auto py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
