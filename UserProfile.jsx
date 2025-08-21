import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile({ userId }) {
  const [profile, setProfile] = useState({ name: '', avatar: '', travelInterests: '', bio: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, profile);
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    }
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <h2 className="text-xl font-bold">My Profile</h2>
      <input name="name" placeholder="Name" value={profile.name} onChange={handleChange} className="border p-2 w-full" />
      <input name="avatar" placeholder="Avatar URL" value={profile.avatar} onChange={handleChange} className="border p-2 w-full" />
      <input name="travelInterests" placeholder="Travel Interests" value={profile.travelInterests} onChange={handleChange} className="border p-2 w-full" />
      <textarea name="bio" placeholder="Bio" value={profile.bio} onChange={handleChange} className="border p-2 w-full" />
      <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2">Update Profile</button>
    </div>
  );
}

export default UserProfile;
