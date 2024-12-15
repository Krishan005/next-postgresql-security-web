"use client";
import React from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js
import Cookies from "js-cookie";

const Navbar = (props: any) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication tokens or session data
    localStorage.removeItem("authToken"); // Example, adapt based on your app
    sessionStorage.clear();
    Cookies.remove("token");

    // Redirect to login
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">{props.name}</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
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
