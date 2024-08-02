import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://bilir-d108588758e4.herokuapp.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login if there's an error
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('https://bilir-d108588758e4.herokuapp.com/api/delete-account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      navigate('/signup'); // Redirect to sign-up page after account deletion
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-info">
          <p><strong>Store Name:</strong> {userData.storeName}</p>
          <p><strong>Password:</strong> {userData.password}</p>
          <p><strong>Store Type:</strong> {userData.storeType}</p>
          <p><strong>Package:</strong> {userData.package}</p>
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          <button onClick={handleDeleteAccount} className="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
