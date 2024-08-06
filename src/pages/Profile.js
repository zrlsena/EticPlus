import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Form, Button, Container, Col, Row, Alert } from 'react-bootstrap';

function Profile() {
  const [userData, setUserData] = useState({
    storeName: '',
    password: '',
    confirmPassword: '',
    category: '',
    packageType: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordError, setPasswordError] = useState('');
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
        setUserData({
          storeName: response.data.storeName,
          password: '',
          confirmPassword: '',
          category: response.data.category,
          packageType: response.data.packageType
        });
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

  const handlePasswordChange = () => {
    if (newPassword1 !== newPassword2) {
      setPasswordMatch(false);
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordMatch(true);
    setPasswordError('');
  };

  const handleUpdate = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updateProfile', {
        storeName: userData.storeName,
        category: userData.category,
        packageType: userData.packageType,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      }, {
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
      await axios.post('https://bilir-d108588758e4.herokuapp.com/api/deleteAccount', {
        userId: localStorage.getItem('userId')
      }, {
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
        <Row>
          {/* Sol Taraf: Profil Bilgileri */}
          <Col md={6}>
            <div className="profile-container">
              <h1>Profile</h1>
              <Form>
                <Form.Group controlId="formStoreName" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">Store Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="storeName"
                    value={userData.storeName}
                    onChange={handleInputChange}
                    placeholder="Store Name"
                  />
                </Form.Group>
                <Form.Group controlId="formCategory" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={userData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                  />
                </Form.Group>
                <Form.Group controlId="formPackageType" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">Package Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="packageType"
                    value={userData.packageType}
                    onChange={handleInputChange}
                    placeholder="Package Type"
                  />
                </Form.Group>
                <Button className='mt-4' variant="primary" onClick={handleUpdate}>
                  Update Profile
                </Button>
              </Form>
            </div>
          </Col>

          {/* Sağ Taraf: Şifre Güncelleme */}
          <Col md={6}>
            <div className="profile-container">
              <h2>Password Update</h2>
              <Form>
                <Form.Group controlId="formPassword" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="New Password"
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                  />
                </Form.Group>
                <Button className='mt-4' variant="primary" onClick={handleUpdate}>
                  Update Password
                </Button>
              </Form>
            </div>

            {/* Kullanıcı İşlemleri */}
            <div className="profile-actions mt-2">
              <Button variant="secondary" onClick={handleLogout} className="me-2">
                Logout
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount} className="ml-2">
                Delete Account
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
