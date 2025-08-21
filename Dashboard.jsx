import React, { useState } from "react";
import TripForm from "./TripForm";
import UserTrips from "./UserTrips";
import ProfileForm from "./ProfileForm";
import GoogleLoginButton from "./GoogleLoginButton";
import EmailLogin from "./EmailLogin";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [refreshTrips, setRefreshTrips] = useState(false);

  const triggerRefresh = () => setRefreshTrips((prev) => !prev);

  const handleLogout = () => {
    setUser(null); // just reset user in state
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg shadow-md text-center space-y-6">
        <h2 className="text-2xl font-bold">Login to Tripmate</h2>

        {/* Google login (mock) */}
        <GoogleLoginButton onLogin={setUser} />

        {/* Email login (mock) */}
        <EmailLogin onLogin={setUser} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          Welcome, {user.displayName || user.email}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Profile */}
      <ProfileForm firebaseUid={user.uid || "mock-uid"} />

      {/* Trips */}
      <TripForm userId={user.uid || "mock-uid"} onTripAdded={triggerRefresh} />
      <UserTrips userId={user.uid || "mock-uid"} refreshTrigger={refreshTrips} />
    </div>
  );
}

export default Dashboard;
