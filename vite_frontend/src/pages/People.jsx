import { useState, useEffect } from "react";
import { useNotification } from "../components/Notification";

export default function People() {
  const { showSuccess, showError } = useNotification();
  const [gender, setGender] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/suggestions");
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, []);

  // Handle gender filter
  const handleGenderChange = async (e) => {
    const selected = e.target.value;
    setGender(selected);
    setLoading(true);

    if (selected) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/filter?gender=${selected}`);
        const data = await res.json();
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error filtering users:", err);
        setFilteredUsers([]);
      }
    } else {
      setFilteredUsers([]);
    }
    setLoading(false);
  };

  const handleAddUser = async (userId) => {
    try {
      // Add user logic here - could be adding to friends, connections, etc.
      console.log("Adding user:", userId);
      showSuccess("User added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
      showError("Failed to add user");
    }
  };

  const femaleSuggestions = suggestions.filter(s => s.gender === "female");

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Discover People</h1>

        {/* Gender Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Travel Companions</h2>
          <div className="max-w-md">
            <label htmlFor="genderSelect" className="block mb-2 text-sm font-medium text-gray-700">
              Filter users by gender:
            </label>
            <select
              id="genderSelect"
              value={gender}
              onChange={handleGenderChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            >
              <option value="">-- All Genders --</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {loading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading users...</p>
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Found {filteredUsers.length} user(s)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-semibold">
                            {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.name}</p>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <p className="text-sm text-gray-500">Gender: {u.gender}</p>
                        {u.interests && u.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {u.interests.slice(0, 2).map((interest, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddUser(u._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gender && filteredUsers.length === 0 && !loading && (
            <div className="mt-6 text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">👥</div>
              <p className="text-gray-500">No users found for the selected gender</p>
            </div>
          )}
        </div>

        {/* Travel Suggestions Section */}
        {femaleSuggestions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Travel Suggestions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {femaleSuggestions.map((s) => (
                <div key={s._id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <h4 className="font-bold text-blue-700 mb-2">{s.title}</h4>
                  <p className="text-gray-700 text-sm mb-2">{s.description}</p>
                  {s.location && (
                    <p className="text-sm text-gray-500">
                      📍 {s.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
