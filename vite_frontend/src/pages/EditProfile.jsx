import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/Notification";

export default function EditProfile() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
    interests: "",
    bio: "",
    gender: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    setUser(storedUser);
    setForm({
      name: storedUser.name || "",
      email: storedUser.email || "",
      avatar: storedUser.avatar || "",
      interests: Array.isArray(storedUser.interests) ? storedUser.interests.join(", ") : (storedUser.interests || ""),
      bio: storedUser.bio || "",
      gender: storedUser.gender || ""
    });
  }, [navigate]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarBase64 = form.avatar;
      if (avatarFile) {
        // Convert file to base64
        avatarBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
      }

      const updateData = {
        name: form.name,
        email: form.email,
        interests: form.interests,
        bio: form.bio,
        gender: form.gender,
        avatarUrl: avatarBase64
      };

      const response = await fetch(`http://localhost:5000/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        showSuccess("Profile updated successfully!");
        navigate("/profile");
      } else {
        const error = await response.json();
        showError("Update failed: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Update error:", err);
      showError("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <div className="mt-2 text-xs text-gray-500">Or paste an image URL below:</div>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="Avatar Image URL"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="Travel, Photography, Food (comma separated)"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}