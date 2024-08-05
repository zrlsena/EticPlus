import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Form, Button, Container, Col } from 'react-bootstrap';
function Profile() {
  const [userData, setUserData] = useState({
    storeName: '',
    password: '',
    category: '',
    packageType: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('https://bilir-d108588758e4.herokuapp.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
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
    const jwt = localStorage.getItem('jwt');
    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updateProfile', userData, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };
  const handleDeleteAccount = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      await axios.post('https://bilir-d108588758e4.herokuapp.com/api/deleteAccount', {}, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      localStorage.removeItem('jwt');
      navigate('/signup');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="background">
      <Navbar />
      <Container className="bg-light p-5 mt-5 rounded">
        <div className="profile-container">
          <h1>Profile</h1>
          <Form>
            <Col className='mt-5'>
              <Form.Group controlId="formStoreName" style={{ width: '25%' }}>
                <Form.Label className="custom-label">Store Name</Form.Label>
                <Form.Control
                  type="text"
                  name="storeName"
                  value={userData.storeName}
                  onChange={handleInputChange}
                  placeholder={userData.storeName || 'Store Name'}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" style={{ width: '25%', marginTop: '15px' }}>
                <Form.Label className="custom-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                />
              </Form.Group>
              <Form.Group controlId="formStoreType" style={{ width: '25%', marginTop: '15px' }}>
                <Form.Label className="custom-label">Store Type</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={userData.category}
                  onChange={handleInputChange}
                  placeholder={userData.category || 'Store Type'}
                />
              </Form.Group>
              <Form.Group controlId="formPackage" style={{ width: '25%', marginTop: '15px' }}>
                <Form.Label className="custom-label">Package</Form.Label>
                <Form.Control
                  type="text"
                  name="packageType"
                  value={userData.packageType}
                  onChange={handleInputChange}
                  placeholder={userData.packageType || 'Package'}
                />
              </Form.Group>
              <Button className='mt-4' variant="primary" onClick={handleUpdate}>
                Update Profile
              </Button>
            </Col>
          </Form>
          <div className="profile-actions mt-2">
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