"use client";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Dashboard</div>
        <div className="lg:hidden">
          {/* Add a menu icon for mobile view */}
          <button className="text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
