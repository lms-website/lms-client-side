//RoleSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { FaChalkboardTeacher, FaUserTie, FaUser } from "react-icons/fa";
import "./RoleSelection.css";
import sideImage from "../../../assets/logo/Logo_2.jpg";
import Cookies from "js-cookie";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    Cookies.set("role", role, {
      expires: 5,
    });
    navigate(`/login`);
  };

  return (
    <div className="container">
      <div className="side-image">
        <img src={sideImage} alt=" " />
      </div>
      <div className="content">
        <h1>Select Your Role</h1>
        <div className="flex">
          <button
            className="flex items-center gap-1"
            onClick={() => handleRoleSelection("student")}
          >
            <FaUser color="white" size={18} />
            <span className="text-white text-xl">Student</span>
          </button>
          <button
            className="flex items-center gap-1"
            onClick={() => handleRoleSelection("teacher")}
          >
            <FaChalkboardTeacher color="white" size={18} />
            <span className="text-white text-xl">Teacher</span>
          </button>
          <button
            className="flex items-center gap-1"
            onClick={() => handleRoleSelection("admin")}
          >
            <FaUserTie color="white" size={18} />
            <span className="text-white text-xl">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
