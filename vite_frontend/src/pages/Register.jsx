import React, { useState } from "react";

const defaultAvatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png"
];

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarUrl: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        className="border p-2 w-full rounded mb-4"
      />

      <label className="block mt-4 font-semibold">Choose an Avatar</label>
      <div className="flex gap-4 mt-2">
        {defaultAvatars.map((url) => (
          <img
            key={url}
            src={url}
            alt="Default Avatar"
            onClick={() => setForm({ ...form, avatarUrl: url })}
            className={`w-16 h-16 rounded-full cursor-pointer border ${
              form.avatarUrl === url ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>

      {form.avatarUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Selected Avatar:</p>
          <img
            src={form.avatarUrl}
            alt="Selected Avatar"
            className="w-24 h-24 rounded-full border mt-2 object-cover"
          />
        </div>
      )}

      <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}