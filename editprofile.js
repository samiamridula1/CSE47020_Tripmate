import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfile({ userId }) {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    interests: ''
  });

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error('Failed to fetch profile', err));
  }, [userId]);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${userId}`, formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <input 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        placeholder="Name" 
      />
      <input 
        name="avatar" 
        value={formData.avatar} 
        onChange={handleChange} 
        placeholder="Avatar URL" 
      />
      <textarea 
        name="bio" 
        value={formData.bio} 
        onChange={handleChange} 
        placeholder="Bio" 
      />
      <input 
        name="interests" 
        value={formData.interests} 
        onChange={handleChange} 
        placeholder="Interests" 
      />
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditProfile;

