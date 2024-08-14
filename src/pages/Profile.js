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
  const [storeNameError, setStoreNameError] = useState('');
  const [currentPasswordValid, setCurrentPasswordValid] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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
          password: response.data.password
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
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const validateCurrentPassword = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await axios.post('https://bilir-d108588758e4.herokuapp.com/api/profile', {
        currentPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (response.data.isValid) {
        setCurrentPasswordValid(true);
        setCurrentPasswordError('');
      } else {
        setCurrentPasswordValid(false);
        setCurrentPasswordError('Current password is incorrect.');
      }
    } catch (error) {
      console.error('Error validating password:', error);
      setCurrentPasswordValid(false);
      setCurrentPasswordError('Failed to validate password. Please try again.');
    }
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
    setStoreNameError('');

    const validationErrors = validatePassword(newPassword);
    setPasswordValidationErrors(validationErrors);
    if (validationErrors.length > 0) {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError('New passwords do not match.');
      return;
    }

    await validateCurrentPassword();
    if (currentPasswordValid === false) {
      return;
    }

    const jwt = localStorage.getItem('jwt');
    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updateProfile', {
        storeName: userData.storeName,
        category: selectedCategory,
        packageType: packageType,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });
      
      setShowSuccessModal(true); 
      setCurrentPasswordError('');
      setConfirmPasswordError('');

    } catch (error) {
      console.error('Error updating profile:', error);
      const { storeName } = userData;
      const storeNameInvalidCharacters = /[^a-zA-Z0-9\s]/;
      const storeNameTurkishCharacters = /[ğüşıöçĞÜŞİÖÇ]/;
      const storeNameDoubleSpaces = /\s{2,}/;
      const storeNameNoLeadingOrTrailingSpaces = /^\S(.*\S)?$/;

      if (storeName.length < 3 || storeName.length > 20) {
        setStoreNameError('Store Name must be between 3 and 20 characters.');
      } else if (storeNameTurkishCharacters.test(storeName)) {
        setStoreNameError('Store name should not contain Turkish characters.');
      } else if (storeNameInvalidCharacters.test(storeName)) {
        setStoreNameError('Store Name must not contain special characters.');
      } else if (storeNameDoubleSpaces.test(storeName)) {
        setStoreNameError('Store Name must not contain consecutive spaces.');
      } else if (!storeNameNoLeadingOrTrailingSpaces.test(storeName)) {
        setStoreNameError('Store Name must not have spaces at the beginning or end.');
      } else {
        setStoreNameError('An unknown error occurred.');
      }
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const handleDeleteAccount = () => setShowDeleteModal(true);
  const handleUpdateProfileClick = () => setShowUpdateModal(true);

  const confirmLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
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
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const confirmUpdateProfile = () => {
    handleUpdateProfile();
    setShowUpdateModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background">
      <Navbar />
      <div className="container mt-5" style={{ maxHeight: '350px', minHeight: '350px', width: '1000px' }}>
        <h1 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>Basic Information</h1>
        <Form className="bg-light p-5 mt-3 rounded d-flex justify-content-center" >
          <Row>
            <Col>
              <Form.Group controlId="formStoreName" style={{ marginBottom: '15px', width: '360px' }}>
                <Form.Label className="custom-label mb-1" style={{fontSize: '16px'}}>Store Name</Form.Label>
                <Form.Control
                  type="text"
                  name="storeName"
                  value={userData.storeName}
                  onChange={handleInputChange}
                  placeholder={userData.storeName}
                  isInvalid={!!storeNameError}
                  style={{borderRadius:'16px',height:'42px',width:'360px',color:'grey',fontSize:'18px'}}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px', width: '360px' }} className='storeError'>
                  {storeNameError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formCategory" style={{ marginBottom: '15px', width: '360px' }}>
                <Form.Label className="custom-label mb-1" style={{fontSize: '16px'}}>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="custom-placeholder"
                  style={{borderRadius:'16px',height:'42px',width:'360px',color:'grey',fontSize:'18px'}}
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

      <div className="container mt-1" style={{ maxHeight: '450px', minHeight: '350px', width: '1000px' }}>
        <h2 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>
          Password Update
        </h2>
        <Form className="bg-light p-5 mt-3  d-flex justify-content-center" >
          <Row style={{ gap:'20px' }} >
            <Col sm={6} style={{ width: '360px', alignItems: 'center', display: 'grid' }}>
              <Form.Group controlId="formCurrentPassword" >
                <Form.Label className="custom-label mb-1" style={{fontSize: '16px'}} >Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  isInvalid={currentPasswordValid === false}
                  style={{borderRadius:'16px',height:'42px',width:'360px',color:'grey',fontSize:'18px'}}

                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }} className='currentpasswordError'>
                  {currentPasswordError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col sm={6} >
              <Form.Group controlId="formNewPassword">
                <Form.Label className="custom-label mb-1" style={{fontSize: '16px'}}>New Password</Form.Label>
                <Form.Control className='mb-3'
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  isInvalid={passwordValidationErrors.length > 0 || !!confirmPasswordError}
                  style={{borderRadius:'16px',height:'42px',width:'360px',color:'#F0F0F0',fontSize:'18px'}}

                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }} className='passwordError'>
                  {passwordValidationErrors.join(', ') || confirmPasswordError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formConfirmNewPassword">
                <Form.Label className="custom-label mb-1" style={{fontSize: '16px'}}>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  isInvalid={!!confirmPasswordError}
                  style={{borderRadius:'16px',height:'42px',width:'360px',color:'grey',fontSize:'18px'}}

                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }} className='passwordError'>
                  {confirmPasswordError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="container mt-1" style={{ width: '1000px', maxHeight: '450px', minHeight: '400px'}}>
        <h2 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>
          Package Type
        </h2>
        <Form className="mt-5 rounded"  >
          <Row className="mb-4">
            {packageData.map((pkg) => (
              <Col md={4} key={pkg.value} >
                <div
                  className={`package-card p-3 rounded-5 ${pkg.value} ${packageType === pkg.value ? 'selected' : ''}`}
                  onClick={() => setPackageType(pkg.value)}
                  style={{height:'310px'}}
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
                        <h3 style={{fontSize:'18px',marginTop:'15px'}}>{pkg.title}</h3>
                        <p style={{fontSize:'14px'}} dangerouslySetInnerHTML={{ __html: pkg.description.replace('**', '<strong>').replace('**', '</strong>') }} />
                        <ul >
                          {pkg.list && pkg.list.map((item, index) => (
                            <li style={{fontSize:'16px'}} key={index}>
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

      <div className="container mt-5" style={{ width: '1000px', maxHeight: '250px' }}>
        <Row className="flex-column">
          <Col className="mb-3">
            <Button variant="primary" onClick={handleUpdateProfile} style={{ width: '100%',height:'42px',fontSize:'18px',borderRadius:'16px' }}>
              Update Profile
            </Button>
          </Col>
          <Col className="mb-3">
            <Button variant="secondary" onClick={handleLogout} style={{ width: '100%',height:'42px',fontSize:'18px',borderRadius:'16px' }}>
              Logout
            </Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={handleDeleteAccount} style={{ width: '100%',height:'42px',fontSize:'18px',borderRadius:'16px' }}>
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
            <Button variant="primary" onClick={confirmUpdateProfile}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
