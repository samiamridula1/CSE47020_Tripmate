import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6 fixed top-0 left-0 shadow-lg">
      <h2 className="text-2xl font-bold mb-8">Tripmate</h2>
      <nav className="space-y-4">
        <Link to="/dashboard" className="block hover:text-green-400">🏠 Dashboard</Link>
        <Link to="/trips" className="block hover:text-green-400">✈️ My Trips</Link>
        <Link to="/my-experiences" className="block hover:text-green-400">🎢 My Experiences</Link>
        <Link to="/profile" className="block hover:text-green-400">👤 Profile</Link>
      </nav>
    </div>
  );
}

export default Sidebar;