import React from "react";
import Login from "../../features/Auth/Login";
import { Outlet } from "react-router-dom";

const UnAuthLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UnAuthLayout;
