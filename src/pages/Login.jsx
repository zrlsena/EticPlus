import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  async function login(storeName, password) {
    try {
      const response = await axios.post('https://bilir-d108588758e4.herokuapp.com/api/login', {
        storeName: storeName,
        password: password
      });

      // Giriş başarılı ise token'ı sakla ve profile sayfasına yönlendir
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('jwtToken', token); // Token'ı localStorage'da sakla
        navigate('/home'); // Profile sayfasına yönlendir
      }
    } catch (error) {
      console.error('Login failed:', error.response.data);
      alert('Login failed. Please check your credentials and try again.');
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    login(storeName, password);
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
            <h1 className="text-center mb-4 fs-2" style={{ marginTop: '20px' }}>Sign In</h1>

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

            <button className="mt-5 btn btn-primary w-100 mb-3" style={{ backgroundColor:'#17CC82',borderColor:'transparent' }} type="submit">
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
