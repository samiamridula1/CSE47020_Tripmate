// src/api/register/index.js

import config from "../../config/api.js";

export async function registerUser({ name, email, password }) {
  try {
    const res = await fetch(`${config.BACKEND_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  } catch (err) {
    return { error: err.message };
  }
}