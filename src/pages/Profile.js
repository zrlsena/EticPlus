import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function Profile() {
  const [userData, setUserData] = useState({
    storeName: '',
    password: '',
    storeType: '',
    package: ''
  });
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
       /* navigate('/login'); // Redirect to login if there's an error*/
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/profile', userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

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

  return (
    <div className="background">
      <Navbar />
      <Container className="bg-light p-5 mt-5 rounded">
      <div className="profile-container">
        <h1>Profile</h1>
        <Form>
          <Col className='mt-5'>
          <Form.Group controlId="formStoreName" style={{width:'25%'}}>
            <Form.Label  className="custom-label">Store Name</Form.Label>
            <Form.Control
              type="text"
              name="storeName"
              value={userData.storeName}
              onChange={handleInputChange}
              placeholder={userData.storeName || 'Store Name'}
            />
          </Form.Group>
          <Form.Group controlId="formPassword" style={{width:'25%', marginTop: '15px'}}>
            <Form.Label  className="custom-label">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              placeholder="********"
            />
          </Form.Group>
          <Form.Group controlId="formStoreType" style={{width:'25%', marginTop: '15px'}}>
            <Form.Label  className="custom-label">Store Type</Form.Label>
            <Form.Control
              type="text"
              name="storeType"
              value={userData.storeType}
              onChange={handleInputChange}
              placeholder={userData.storeType || 'Store Type'}
            />
          </Form.Group>
          <Form.Group controlId="formPackage" style={{width:'25%', marginTop: '15px'}}>
            <Form.Label  className="custom-label">Package</Form.Label>
            <Form.Control
              type="text"
              name="package"
              value={userData.package}
              onChange={handleInputChange}
              placeholder={userData.package || 'Package'}
            />
          </Form.Group>
          <Button className='mt-4' variant="primary" onClick={handleUpdate}>
            Update Profile
          </Button>
          </Col>
        </Form>
        
        <div className="profile-actions mt-2 ">
          <Button variant="secondary" onClick={handleLogout} className="me-2">
            Logout
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} className="ml-2">
            Delete Account
          </Button>
        </div>
      </div>
      </Container>
    </div>
  );
}

export default Profile;


  
  /*
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
        navigate('/login');
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
  );*/

