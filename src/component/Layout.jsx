import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 via-white to-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-white shadow-inner rounded-l-3xl transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;
