"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar starts collapsed on mobile

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`relative ${
        isOpen ? "w-64" : "w-16"
      } bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white h-full transition-all duration-300`}
    >
      {/* Button to toggle the sidebar */}
      <button
        onClick={toggleSidebar}
        className=" absolute top-4 left-4 p-2 text-white bg-gray-700 rounded-md"
      >
        {/* lg:hidden */}
        <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Sidebar content */}
      <div className="mt-12">
        <ul>
          <li className={`p-4 hover:bg-gray-700 ${!isOpen ? "hidden" : ""}`}>
            <a href="#">Dashboard</a>
          </li>
          <li className={`p-4 hover:bg-gray-700 ${!isOpen ? "hidden" : ""}`}>
            <a href="#">Settings</a>
          </li>
          <li className={`p-4 hover:bg-gray-700 ${!isOpen ? "hidden" : ""}`}>
            <a href="#">Profile</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
