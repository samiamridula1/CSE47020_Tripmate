// src/components/ProfileForm.js
import React, { useState } from "react";
import axios from "axios";

function ProfileForm({ onProfileCreated }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Convert interests string to array
      const interestsArray = interests.split(",").map(i => i.trim());

      const response = await axios.post("http://localhost:5000/api/users", {
        name,
        avatar,
        bio,
        interests: interestsArray,
      });

      onProfileCreated(response.data); // Send back the created profile
      console.log("Profile created:", response.data);

      // Clear form
      setName("");
      setAvatar("");
      setBio("");
      setInterests("");

    } catch (err) {
      console.error(err);
      setError("Error creating profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">Avatar URL</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">Interests (comma separated)</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        Create Profile
      </button>
    </form>
  );
}

export default ProfileForm;
