import React from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
          <p className="mt-4">This is the dashboard page content.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
