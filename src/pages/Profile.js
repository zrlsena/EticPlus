import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { packageData } from '../components/PackageData';
import { Form, Button, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [packageType, setPackageType] = useState(''); 
  const [storeNameError, setStoreNameError] = useState('');

  // New States for Category Dropdown
  const [categories, setCategories] = useState([]); // List of categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Currently selected category

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
        setSelectedCategory(response.data.category); // Set default category

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
        setCategories(response.data); // Fetch categories and set to state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchUserData();
    fetchCategories(); // Fetch categories on mount
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleUpdateProfile = async () => {
    setStoreNameError('');

    const jwt = localStorage.getItem('jwt');
    try {
      await axios.put('https://bilir-d108588758e4.herokuapp.com/api/updateProfile', {
        storeName: userData.storeName,
        category: selectedCategory, // Use selected category
        packageType: packageType, // Use updated packageType state here
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      alert('Profile updated successfully');
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
        setStoreNameError('An error occurred while updating the profile. Please try again later.');
      }
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
      <div className="container mt-5 border" style={{ maxHeight: '350px', minHeight: '350px',width: '1000px' }}>
        <h1 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>Basic Information</h1>
        <Form className="bg-light p-5 mt-3 rounded" style={{ height: '200px' }}>
          <Row>
            <Col>
              <Form.Group controlId="formStoreName" style={{ marginBottom: '15px' }}>
                <Form.Label className="custom-label">Store Name</Form.Label>
                <Form.Control
                  type="text"
                  name="storeName"
                  value={userData.storeName}
                  onChange={handleInputChange}
                  placeholder={userData.storeName}
                  isInvalid={!!storeNameError}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.875rem', marginTop: '5px' }}>
                  {storeNameError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formCategory">
                <Form.Label className="custom-label">Category</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCategory} // Use selectedCategory for dropdown
                  onChange={(e) => setSelectedCategory(e.target.value)} // Update selectedCategory state on change
                  className="custom-placeholder"
                  style={{ fontSize: '0.9rem', height: '2.5rem' }}
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

      <div className="container mt-1 border" style={{ maxHeight: '350px',  minHeight: '350px',width: '1000px' }}>
        <h2 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>
          Password Update
        </h2>
        <Form className="bg-light p-5 mt-3 rounded d-flex justify-content-center" style={{ height: '240px' }}>
          <Row>
            <Col sm={6} style={{ width: '360px', alignItems: 'center', display: 'grid' }}>
              <Form.Group controlId="formCurrentPassword">
                <Form.Label className="custom-label">Current Password</Form.Label>
                <Form.Control
                  type={"password"}
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                />
              </Form.Group>
            </Col>
            <Col sm={6} style={{ width: '360px' }}>
              <Form.Group controlId="formNewPassword1">
                <Form.Label className="custom-label">New Password</Form.Label>
                <Form.Control className='mb-3'
                  type={"password"}
                  name="newPassword1"
                  value={newPassword1}
                  onChange={(e) => setNewPassword1(e.target.value)}
                  placeholder="New Password"
                />
              </Form.Group>
              <Form.Group controlId="formNewPassword2">
                <Form.Label className="custom-label">Confirm New Password</Form.Label>
                <Form.Control
                  type={"password"}
                  name="newPassword2"
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                  placeholder="Confirm New Password"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="container mt-1 border" style={{ width: '1000px', maxHeight: '350px', minHeight: '350px' }}>
        <h2 className="text-start" style={{ width: '1000px', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>
          Package Type
        </h2>
        <Form className=" mt-5 rounded" style={{ height: '240px' }}>
          <Row className="mb-4">
            {packageData.map((pkg) => (
              <Col md={4} key={pkg.value}>
                <div
                  className={`package-card p-3 border rounded-5 ${pkg.value} ${packageType === pkg.value ? 'selected' : ''}`}
                  onClick={() => setPackageType(pkg.value)}
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
                    <Form.Check.Label>
                      <div className="package-content">
                        <h3>{pkg.title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: pkg.description.replace('**', '<strong>').replace('**', '</strong>') }} />
                        <ul>
                          {pkg.list && pkg.list.map((item, index) => (
                            <li key={index}>
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

      <div className="container mt-5 border" style={{ width: '1000px', minHeight: '250px' }}>
        <Row className="flex-column">
          <Col className="mb-3">
            <Button variant="primary" onClick={handleUpdateProfile} style={{ width: '100%' }}>
              Update Profile
            </Button>
          </Col>
          <Col className="mb-3">
            <Button variant="secondary" onClick={handleLogout} style={{ width: '100%' }}>
              Logout
            </Button>
          </Col>
          <Col>
            <Button variant="danger" onClick={handleDeleteAccount} style={{ width: '100%' }}>
              Delete Account
            </Button>
          </Col>
        </Row>
      </div>

    </div>
  );
}

export default Profile;
