import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm px-8">
      <div className="flex-1 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-xl font-bold text-primary">ResumeForge</span>
      </div>
    </div>
  );
};

export default Navbar;