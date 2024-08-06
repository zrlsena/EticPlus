import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Form, Button, Container, Col, Row, Alert } from 'react-bootstrap';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Profile() {
  const [userData, setUserData] = useState({
    storeName: '',
    category: '',
    packageType: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword1: false,
    newPassword2: false
  });

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

  const handleUpdateProfile = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updateProfile', {
        storeName: userData.storeName,
        category: userData.category,
        packageType: userData.packageType
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

  const handleUpdatePassword = async () => {
    if (newPassword1 !== newPassword2) {
      setPasswordMatch(false);
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordMatch(true);
    setPasswordError('');
  
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword1);
  
    const jwt = localStorage.getItem('jwt');
    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updatePassword', {
        currentPassword: currentPassword,
        newPassword: newPassword1
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      alert('Password updated successfully');
      setCurrentPassword('');
      setNewPassword1('');
      setNewPassword2('');
    } catch (error) {
      console.error('Error updating password:', error.response ? error.response.data : error.message);
      alert('An error occurred while updating the password.');
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

  const togglePasswordVisibility = (field) => {
    setPasswordVisible({
      ...passwordVisible,
      [field]: !passwordVisible[field]
    });
  };

  return (
    <div className="background">
      <Navbar />
      <Container className="bg-light p-5 mt-5 rounded">
        <Row>
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
                <Button className='mt-4' variant="primary" onClick={handleUpdateProfile}>
                  Update Profile
                </Button>
              </Form>
            </div>
          </Col>

          <Col md={6}>
            <div className="profile-container">
              <h2>Password Update</h2>
              <Form>
                <Form.Group controlId="formCurrentPassword" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">Current Password</Form.Label>
                  <div className="password-container">
                    <Form.Control
                      type={passwordVisible.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password"
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('currentPassword')} className="password-toggle-button">
                      <FontAwesomeIcon icon={passwordVisible.currentPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </Form.Group>

                <Form.Group controlId="formNewPassword1" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">New Password</Form.Label>
                  <div className="password-container">
                    <Form.Control
                      type={passwordVisible.newPassword1 ? "text" : "password"}
                      name="newPassword1"
                      value={newPassword1}
                      onChange={(e) => setNewPassword1(e.target.value)}
                      placeholder="New Password"
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('newPassword1')} className="password-toggle-button">
                      <FontAwesomeIcon icon={passwordVisible.newPassword1 ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </Form.Group>

                <Form.Group controlId="formNewPassword2" style={{ marginBottom: '15px' }}>
                  <Form.Label className="custom-label">Confirm New Password</Form.Label>
                  <div className="password-container">
                    <Form.Control
                      type={passwordVisible.newPassword2 ? "text" : "password"}
                      name="newPassword2"
                      value={newPassword2}
                      onChange={(e) => setNewPassword2(e.target.value)}
                      placeholder="Confirm New Password"
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('newPassword2')} className="password-toggle-button">
                      <FontAwesomeIcon icon={passwordVisible.newPassword2 ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </Form.Group>

                {!passwordMatch && (
                  <Alert variant="danger">
                    {passwordError}
                  </Alert>
                )}
                <Button className='mt-4' variant="primary" onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </Form>
            </div>

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
