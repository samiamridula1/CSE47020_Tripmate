import config from "../config/api.js";

export async function registerUser({ email, password, name }) {
  const res = await fetch(`${config.BACKEND_API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${config.BACKEND_API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function fetchSuggestions() {
  try {
    const res = await fetch(`${config.BACKEND_API_URL}/suggestions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
}