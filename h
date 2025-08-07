import React from 'react';
import UserProfile from '../components/UserProfile';
import EditProfile from '../components/editprofile';
import TripForm from '../components/TripForm';

function App() {
  return (
    <div>
      <h1>Tripmate</h1>
      <UserProfile />
      <EditProfile />
      <TripForm />
    </div>
  );
}

export default App;
