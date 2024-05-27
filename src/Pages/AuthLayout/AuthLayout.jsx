import React from "react";
import Sidebar from "../../Ui/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../../Ui/Header";

const AuthLayout = () => {
  return (
    <div className=" h-screen bg-body flex ">
      <Sidebar />
      <div className="h-full px-4 flex-1 overflow-y-auto py-4 flex flex-col gap-8">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
