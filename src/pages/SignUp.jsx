import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import axios from 'axios';
import { packageData } from '../components/PackageData';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [packageType, setPackageType] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const apiUrl = 'https://bilir-d108588758e4.herokuapp.com/api/register';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(response.data); // response.data'nın [{ id, name }] formatında olduğunu varsayıyoruz
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          storeName,
          category: selectedCategory,
          password,
          packageType,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();

      console.log('Sign Up successful:', data);
      navigate('/login'); // Başarılı girişten sonra yönlendirme
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const validateForm = async () => {
    let isValid = true;
    setStoreNameError('');
    setPasswordError('');
    setCategoryError('');
    setPackageError('');

    const passwordCriteria = [
      { regex: /.{4,15}/, message: 'Password must be between 4 and 15 characters.' },
      { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter.' },
      { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter.' },
      { regex: /\d/, message: 'Password must contain at least one digit.' },
      { regex: /^[^ğüşıöçĞÜŞİÖÇ]+$/, message: 'Password must not contain Turkish characters.' },
    ];

    if (storeName.length < 3 || storeName.length > 20) {
      setStoreNameError('StoreName must be between 3 and 20 characters.');
      isValid = false;
    }

    for (const criterion of passwordCriteria) {
      if (!criterion.regex.test(password)) {
        setPasswordError(criterion.message);
        isValid = false;
        break;
      }
    }

    if (!selectedCategory) {
      setCategoryError('Please select a store.');
      isValid = false;
    }

    if (!packageType) {
      setPackageError('Please select a package.');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/check-store-name?storeName=${storeName}`);
        if (response.data.exists) {
          setStoreNameError('Store name is already taken.');
          isValid = false;
        }
      } catch (error) {
        console.error('Error checking store name:', error);
        setStoreNameError('This store name already exist.');
        isValid = false;
      }
    }

    return isValid;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="background">
      <Container className="container d-flex align-items-center justify-content-center">
        <div className="sign-page">
          <Link to="/">
            <img className="logo" src="/images/eticLogo.png" alt="Etic PLUS Logo" />
          </Link>

          <div className="welcome-section">
            <img src="/images/signupWelcome.png" alt="Etic PLUS Logo" />
          </div>

          <Form onSubmit={handleSignIn} className="sign-form bg-light p-4 rounded">
            <h1 className="mb-1 text-center fs-2">Sign Up</h1>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formStoreName">
                  <Form.Label className='input-title'>Store Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    minLength="3"
                    maxLength="20"
                    placeholder="Between 3 and 20 characters"
                    isInvalid={!!storeNameError}
                    className="custom-placeholder"
                  />
                  <Form.Control.Feedback type="invalid">
                    {storeNameError}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label className='input-title'>Password</Form.Label>
                  <div className="password-container">
                  <Form.Control
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="4"
                    maxLength="15"
                    placeholder="Create strong password"
                    isInvalid={!!passwordError}
                    className="custom-placeholder"
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                  </button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {passwordError}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className='input-title'>Store Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                isInvalid={!!categoryError}
                className="custom-placeholder"
              >
                <option value="">Select a store category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {categoryError}
              </Form.Control.Feedback>
            </Form.Group>

            <h2 className="mb-2 fs-6 text-center">Choose Your Plan</h2>

            <Row className="mb-4">
              {packageData.map(pkg => (
                <Col md={4} key={pkg.value}>
                  <div
                    className={`package-card p-3 border rounded ${packageType === pkg.value ? 'selected' : ''}`}
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
                                {pkg.value === 'PLATINUM' && (
                                  <span className="text-success fw-bold text-end">✔</span>
                                )}
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

            <Button
              type="submit"
              className="btn btn-primary w-100 mb-3 bg-success"
            >
              Sign Up
            </Button>
            <p className="text-center">
              Already have a store? <Link to="/login">Login</Link>.
            </p>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
