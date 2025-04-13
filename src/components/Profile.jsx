// src/components/Profile.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  
  if (!isAuthenticated) return null;
  
  return (
    <div style={{ marginTop: '10px' }}>
      <img src={user.picture} alt={user.name} style={{ width: '50px', borderRadius: '50%' }} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default Profile;
