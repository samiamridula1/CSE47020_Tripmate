// src/components/common/TopBar.jsx
import React from "react";

function TopBar({ userName, onLogout }) {
  return (
    <div className="bg-white px-5 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
      <span className="text-lg font-medium text-gray-700">Welcome, {userName}</span>
      <button 
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
}

export default TopBar;