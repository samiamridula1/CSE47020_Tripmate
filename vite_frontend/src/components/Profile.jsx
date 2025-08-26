import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [gender, setGender] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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

    if (selected) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/gender/${selected}`);
        const data = await res.json();
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const handleAddUser = (userId) => {
    console.log("User added:", userId);
  };

  if (!user) {
    return (
      <p className="text-center text-gray-600 mt-8">
        Please log in to view your profile.
      </p>
    );
  }

  const femaleSuggestions = suggestions.filter(s => s.gender === "female");

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-10">
      <div className="text-center space-y-4">
        <img
          src={user.avatarUrl}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md object-cover mx-auto"
        />
        <h2 className="text-2xl font-bold text-gray-900">
          {user.name || user.email}
        </h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-700 max-w-md mx-auto">
          {user.bio || (
            <span className="italic text-gray-500">
              No bio yet.{" "}
              <Link to="/edit-profile" className="text-blue-600 hover:underline">
                Add one
              </Link>
            </span>
          )}
        </p>
        {user.interest && (
          <span className="text-sm text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full inline-block mt-2">
            {user.interest}
          </span>
        )}
        <Link
          to="/edit-profile"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Edit Profile
        </Link>
      </div>

      <div>
        <label htmlFor="genderSelect" className="block mb-2 text-sm font-medium text-gray-700">
          Filter users by gender:
        </label>
        <select
          id="genderSelect"
          value={gender}
          onChange={handleGenderChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Select Gender --</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        {filteredUsers.length > 0 && (
          <div className="mt-6 space-y-4">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between border border-gray-200 rounded p-3 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  {u.avatarUrl && (
                    <img
                      src={u.avatarUrl}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{u.name}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-sm text-gray-500">Gender: {u.gender}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddUser(u._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  ➕ Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {femaleSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Suggestions for You</h3>
          <div className="space-y-4">
            {femaleSuggestions.map((s) => (
              <div key={s._id} className="border p-4 rounded shadow-sm bg-gray-50">
                <h4 className="font-bold text-indigo-700">{s.title}</h4>
                <p className="text-gray-700">{s.description}</p>
                {s.location && (
                  <p className="text-sm text-gray-500 mt-1">Location: {s.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Logout />
    </div>
  );
}