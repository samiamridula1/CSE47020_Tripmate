import React, { useState, useEffect } from "react";

function EditProfile({ userId }) {
  const [formData, setFormData] = useState({
    name: "",
    avatarUrl: "",
    bio: "",
    travelInterests: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  // Load profile from localStorage (or mock API)
  useEffect(() => {
    if (!userId) {
      setMessage("User ID not available. Cannot load profile for editing.");
      setMessageType("error");
      return;
    }

    setMessage("Loading profile for editing...");
    setMessageType("");

    try {
      const savedProfile = localStorage.getItem(`profile-${userId}`);
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setFormData({
          name: data.name || "",
          avatarUrl: data.avatarUrl || "",
          bio: data.bio || "",
          travelInterests: Array.isArray(data.travelInterests)
            ? data.travelInterests.join(", ")
            : data.travelInterests || "",
        });
        setMessage("Profile loaded. Ready to edit.");
        setMessageType("success");
      } else {
        setFormData({
          name: "",
          avatarUrl: "",
          bio: "",
          travelInterests: "",
        });
        setMessage("No existing profile found. Fill out the form to create one.");
        setMessageType("success");
      }
    } catch (e) {
      console.error("Error loading profile:", e);
      setMessage(`Error loading profile: ${e.message}`);
      setMessageType("error");
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile (localStorage for now)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User ID not available. Cannot save profile.");
      setMessageType("error");
      return;
    }

    setMessage("Saving profile...");
    setMessageType("");

    try {
      const dataToSave = {
        ...formData,
        travelInterests: formData.travelInterests
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      };

      // Save to localStorage (mock backend)
      localStorage.setItem(`profile-${userId}`, JSON.stringify(dataToSave));

      setMessage("Profile updated successfully! 🎉");
      setMessageType("success");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(`Failed to update profile: ${error.message}`);
      setMessageType("error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Edit Your Profile
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm text-center ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Avatar URL:
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio:
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself and your travel style!"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="travelInterests"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Travel Interests (comma separated):
          </label>
          <input
            type="text"
            id="travelInterests"
            name="travelInterests"
            value={formData.travelInterests}
            onChange={handleChange}
            placeholder="hiking, beach, food, culture, adventure"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
