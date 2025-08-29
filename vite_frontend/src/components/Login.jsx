import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./Notification";

export default function Login({ setUser }) {
  const { showError } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Add isAuthenticated flag to user data
      const userData = { ...res.data, isAuthenticated: true };

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Update app state
      setUser(userData);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      showError(
        err.response?.data?.error ||
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Sign in to your account
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register here
        </a>
      </p>
    </div>
  );
}