import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'react-bootstrap'; // Form bileşenini içe aktardık
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login request with:', { storeName, password });
      const response = await axios.post('https://bilir-d108588758e4.herokuapp.com/api/login', {
        storeName,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile'); // Ensure '/profile' route exists
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.data) {
        // Show specific error message from server
        alert(`Login failed: ${error.response.data.message || 'An error occurred during login.'}`);
      } else {
        alert('An error occurred during login.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="background">
      <div className="container d-flex align-items-center justify-content-center">
        <div className="sign-page">
          <Link to="/">
            <img className="logo" src="/images/eticLogo.png" alt="Etic PLUS Logo" />
          </Link>

          <div className="welcome-section">
            <img src="/images/welcomeback.png" alt="Welcome Back" />
          </div>

          <form onSubmit={handleLogin} className="sign-form bg-light p-4 rounded">
            <h1 className="text-center mb-4 fs-2">Sign In</h1>

            <div className="form-group mb-3">
              <Form.Label className="input-title">Store Name</Form.Label>
              <Form.Control
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name"
                isInvalid={!!storeNameError}
                className="custom-placeholder"
              />
              <Form.Control.Feedback type="invalid" className="d-block">
                {storeNameError}
              </Form.Control.Feedback>
            </div>

            <div className="form-group mb-3">
              <Form.Label className="input-title">Password</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  isInvalid={!!passwordError}
                  className="custom-placeholder"
                />
                <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="d-block">
                {passwordError}
              </Form.Control.Feedback>
            </div>

            <button className="btn btn-primary w-100 mb-3 bg-success" type="submit">
              Sign In
            </button>

            <p className="text-center">
              Don't have an account? <Link to="/signup">Sign up!</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
