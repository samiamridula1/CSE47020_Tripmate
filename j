// frontend/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from "firebase/auth";

function UserProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    name: '',
    avatarUrl: '',
    travelInterests: [],
    bio: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const res = await axios.get(`/api/users/profile/${user.uid}`);
        if(res.data) setProfile(res.data);
      } catch (e) {
        console.log('No profile found');
      }
    }
    fetchProfile();
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Login required");
    try {
      const res = await axios.post('/api/users/profile', {
        firebaseUID: user.uid,
        email: user.email,
        ...profile
      });
      alert('Profile saved!');
    } catch (error) {
      console.error(error);
      alert('Error saving profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={profile.name}
        onChange={e => setProfile({ ...profile, name: e.target.value })}
      />
      <input
        type="url"
        placeholder="Avatar URL"
        value={profile.avatarUrl}
        onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })}
      />
      <input
        type="text"
        placeholder="Travel Interests (comma separated)"
        value={profile.travelInterests.join(', ')}
        onChange={e => setProfile({ ...profile, travelInterests: e.target.value.split(',').map(s => s.trim()) })}
      />
      <textarea
        placeholder="Bio"
        value={profile.bio}
        onChange={e => setProfile({ ...profile, bio: e.target.value })}
      />
      <button type="submit">Save Profile</button>
    </form>
  );
}

export default UserProfile;
