import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children, userName, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 ml-64">
          <header className="p-4 bg-white shadow-sm flex justify-between items-center border-b">
            <h1 className="text-lg font-semibold text-gray-800">
              Welcome, <span className="text-indigo-600">{userName}</span>
            </h1>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>

      <footer className="bg-gray-100 text-center py-3 text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} CSE470 Project — All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;