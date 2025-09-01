import { Link } from "react-router-dom";
import Logout from "./Logout";
import RecentActivity from "./RecentActivity";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <Link 
            to="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center overflow-hidden">
              {(user.avatar && user.avatar.startsWith('data:image')) ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-600 font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name || user.email}
            </h1>
            
            <p className="text-gray-600">{user.email}</p>
            
            {user.bio && (
              <p className="text-gray-700 max-w-2xl mx-auto">
                {user.bio}
              </p>
            )}
            
              {user.interests && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {(Array.isArray(user.interests) ? user.interests : String(user.interests).split(',').map(i => i.trim())).filter(Boolean).map((interest, index) => (
                    <span
                      key={index}
                      className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
              </div>
            )}
            
            <div className="flex justify-center space-x-4 mt-6">
              <Link
                to="/edit-profile"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </Link>
              <Link
                to="/people"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Discover People
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <RecentActivity currentUserId={user._id || user.id} />

        {/* Logout Section */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <Logout />
        </div>
      </div>
    </div>
  );
}
