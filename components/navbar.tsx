"use client";
import React from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js
import Cookies from "js-cookie";

let userDetails: any = {};
if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
  userDetails = JSON.parse(window.atob(String(sessionStorage.getItem("user"))));
}
const roleID = userDetails?.role;
const email = userDetails?.email; // Extract email from user details

// Determine role name based on roleID
let roleName = "";
if (roleID === 2) {
  roleName = "Admin";
} else if (roleID === 1) {
  roleName = "Editor";
} else if (roleID === 0) {
  roleName = "User";
}

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
          {/* Display Role Name */}
          <span className="text-sm font-semibold">{roleName}</span>
          {/* Display Email */}
          <span className="text-sm font-semibold">{email}</span>
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
