// src/components/LoginButton.js
import React, { useState } from "react";
import axios from "axios";

function LoginButton({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send login request to your backend
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Backend should return full user profile: name, email, avatar, bio, interests
      const userProfile = response.data;
      onLogin(userProfile); // Pass user profile to parent

    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}

export default LoginButton;
