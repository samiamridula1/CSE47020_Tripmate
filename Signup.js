// frontend/src/components/Signup.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [interests, setInterests] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      // 2️⃣ Send user data to backend (MongoDB)
      const response = await axios.post("http://localhost:5000/api/users/profile", {
        firebaseUid,
        name,
        email,
        bio,
        avatar,
        interests: interests.split(",").map(i => i.trim()), // convert comma-separated string to array
      });

      console.log("User profile saved:", response.data);
      alert("Signup successful!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="text" placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
      <input type="text" placeholder="Avatar URL" value={avatar} onChange={e => setAvatar(e.target.value)} />
      <input type="text" placeholder="Interests (comma-separated)" value={interests} onChange={e => setInterests(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
