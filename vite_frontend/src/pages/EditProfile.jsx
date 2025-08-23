import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditProfile({ user }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    interest: "",
    bio: "",
    gender: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
        interest: user.interest || "",
        bio: user.bio || "",
        gender: user.gender || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/edit-profile/${user._id}`, form);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-center mb-4">Edit Profile</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 w-full rounded"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full rounded"
      />

      <input
        name="avatarUrl"
        value={form.avatarUrl}
        onChange={handleChange}
        placeholder="Avatar Image URL"
        className="border p-2 w-full rounded"
      />

      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Bio"
        className="border p-2 w-full rounded h-24 resize-none"
      />

      <input
        name="interest"
        value={form.interest}
        onChange={handleChange}
        placeholder="Interest"
        className="border p-2 w-full rounded"
      />

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="">Select Gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Save Changes
      </button>
    </form>
  );
}