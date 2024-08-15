import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { packageData } from '../components/PackageData';
import { Form, Button, Col, Row, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [userData, setUserData] = useState({
    storeName: '',
    category: '',
    packageType: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [packageType, setPackageType] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
          packageType: response.data.packageType,
        });

        setPackageType(response.data.packageType);
        setSelectedCategory(response.data.category);

      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://bilir-d108588758e4.herokuapp.com/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchUserData();
    fetchCategories();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const passwordCriteria = [
    { regex: /.{4,15}/, message: 'Password must be between 4 and 15 characters.' },
    { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter.' },
    { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter.' },
    { regex: /\d/, message: 'Password must contain at least one digit.' },
    { regex: /^[^ğüşıöçĞÜŞİÖÇ]+$/, message: 'Password must not contain Turkish characters.' },
    { regex: /^\S*$/, message: 'Password must not contain spaces.' },
  ];

  const validatePassword = (password) => {
    const errors = passwordCriteria
      .filter(criteria => !criteria.regex.test(password))
      .map(criteria => criteria.message);
    return errors;
  };

  const handleUpdateProfile = async () => {
    setCurrentPasswordError('');

    let passwordErrors = [];
    if (newPassword || confirmNewPassword || currentPassword) {
      passwordErrors = validatePassword(newPassword);
      setPasswordValidationErrors(passwordErrors);

      if (passwordErrors.length > 0 || newPassword !== confirmNewPassword) {
        setConfirmPasswordError(newPassword !== confirmNewPassword ? 'Passwords do not match.' : '');
        return;
      }
    } else {
      setPasswordValidationErrors([]);
      setConfirmPasswordError('');
    }

    const jwt = localStorage.getItem('jwt');
    const updateData = {
      category: selectedCategory,
      packageType: packageType,
    };

    if (newPassword && confirmNewPassword && currentPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
      updateData.confirmNewPassword = confirmNewPassword;
    }

    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updateProfile', updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentPasswordError('');
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error updating profile:', error);

      if (error.response && error.response.data.errorCode === "INVALID_CURRENT_PASSWORD") {
        setCurrentPasswordError('Current password is incorrect.');
      } else {
        setCurrentPasswordError('Unknown error occurred.');
      }
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const handleDeleteAccount = () => setShowDeleteModal(true);

  const confirmLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
    window.location.reload();
    setShowLogoutModal(false);
  };

  const confirmDeleteAccount = async () => {
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
      window.location.reload();
      setShowDeleteModal(false);
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
      <div className="container" style={{ maxHeight: '350px', minHeight: '350px', width: '1000px', marginTop:'130px' }}>
        <h1 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>Basic Information</h1>
        <Form className="bg-light p-5 mt-3 rounded d-flex justify-content-center" >
          <Row>
            <Col>
              <Form.Group controlId="formStoreName" style={{ marginBottom: '15px', width: '360px' }}>
                <Form.Label className="custom-label mb-1" style={{ fontSize: '16px' }}>Store Name</Form.Label>
                <Form.Control
                  type="text"
                  name="storeName"
                  value={userData.storeName}
                  readOnly
                  style={{ borderRadius: '16px', height: '42px', width: '360px', color: 'grey', fontSize: '18px' }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formCategory" style={{ marginBottom: '15px', width: '360px' }}>
                <Form.Label className="custom-label mb-1" style={{ fontSize: '16px' }}>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="custom-placeholder"
                  style={{ borderRadius: '16px', height: '42px', width: '360px', color: 'grey', fontSize: '18px' }}
                >
                  <option value="">Select a store category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="container mt-1" style={{ maxHeight: '450px', minHeight: '420px', width: '1000px' }}>
        <h2 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>
          Password Update
        </h2>
        <Form className="bg-light p-5 mt-3 d-flex justify-content-center">
          <Row style={{ gap: '20px' }} >
            <Col sm={6} style={{ width: '360px', alignItems: 'center', display: 'grid' }}>
              <Form.Group controlId="formCurrentPassword" >
                <Form.Label className="custom-label mb-1" style={{ fontSize: '16px' }} >Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  minLength="4"
                    maxLength="15"
                  placeholder="Current password"
                  isInvalid={currentPassword && !!currentPasswordError} // Display only if there's input
                  style={{ borderRadius: '16px', height: '42px', width: '360px', color: 'grey', fontSize: '18px' }}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }} className='currentpasswordError'>
                  {currentPasswordError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group controlId="formNewPassword">
                <Form.Label className="custom-label mb-1" style={{ fontSize: '16px' }}>New Password</Form.Label>
                <Form.Control className='mb-3'
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength="4"
                    maxLength="15"
                  placeholder="New password"
                  isInvalid={!!passwordValidationErrors.length && newPassword} // Display only if there's input
                  style={{ borderRadius: '16px', height: '42px', width: '360px', color: 'grey', fontSize: '18px' }}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }} className='passwordError'>
  {passwordValidationErrors.map((error, index) => (
    <div key={index}>{error}</div>
  ))}
</Form.Control.Feedback>

              </Form.Group>

              <Form.Group controlId="formConfirmNewPassword">
                <Form.Label className="custom-label mb-1" style={{ fontSize: '16px' }}>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  minLength="4"
                    maxLength="15"
                  placeholder="Confirm new password"
                  isInvalid={confirmNewPassword && !!confirmPasswordError} // Display only if there's input
                  style={{ borderRadius: '16px', height: '42px', width: '360px', color: 'grey', fontSize: '18px' }}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }} className='passwordError'>
                  {confirmPasswordError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

     
      <div className="container mt-1" style={{ width: '1000px', maxHeight: '450px', minHeight: '400px' }}>
        <h2 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>
          Package Type
        </h2>
        <Form className=" mt-5 rounded" style={{ height: '240px' }}>
          <Row className="mb-4">
            {packageData.map((pkg) => (
              <Col md={4} key={pkg.value} >
                <div
                  className={`package-card p-3 rounded-5 ${pkg.value} ${packageType === pkg.value ? 'selected' : ''}`}
                  onClick={() => setPackageType(pkg.value)}
                  style={{ height: '310px', borderRadius:'40px' }}
                >
                  <Form.Check
                    type="radio"
                    value={pkg.value}
                    checked={packageType === pkg.value}
                    onChange={(e) => setPackageType(e.target.value)}
                    id={pkg.value}
                    name="package"
                  >
                    <Form.Check.Input type="radio" className="d-none" />
                    <Form.Check.Label >
                      <div className="package-content" >
                        <h3 style={{ fontSize: '18px', marginTop: '15px' }}>{pkg.title}</h3>
                        <p style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: pkg.description.replace('**', '<strong>').replace('**', '</strong>') }} />
                        <ul>
                          {pkg.list && pkg.list.map((item, index) => (
                            <li style={{ fontSize: '16px' }} key={index}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Form.Check.Label>
                  </Form.Check>
                </div>
              </Col>
            ))}
          </Row>
        </Form>
      </div>

      <div className="container mt-5" style={{ width: '1000px', maxHeight: '250px',marginTop:'10px' }}>
        <Row className="flex-column">
          <Col className="mb-3">
            <Button variant="primary" onClick={() => setShowUpdateModal(true)} style={{ width: '100%', height: '42px', fontSize: '18px', borderRadius: '16px' }}>
              Update Profile
            </Button>
          </Col>
          <Col className="mb-3">
            <Button variant="secondary" onClick={handleLogout} style={{ width: '100%', height: '42px', fontSize: '18px', borderRadius: '16px' }}>
              Logout
            </Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={handleDeleteAccount} style={{ width: '100%', height: '42px', fontSize: '18px', borderRadius: '16px' }}>
              Delete Account
            </Button>
          </Col>
        </Row>

        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to logout?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmLogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Account Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete your account? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteAccount}>
              Delete Account
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Profile Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to update your profile?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {
              handleUpdateProfile();
              setShowUpdateModal(false);
            }}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your profile has been successfully updated.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      
    </div>
  );
}

export default Profile;