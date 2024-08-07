import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../config';

const Login = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  async function login(storeName, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          storeName: storeName,
          password: password
        })
      });

      const data = await response.json();
      console.log("Response Data:", data); 

      if (response.status === 200) {
        const jwt = data.jwt;
        localStorage.setItem('jwt', jwt);
        navigate('/home');
      } else if (response.status === 401) {
        if (data.error === 'Invalid store name') {
          setStoreNameError('Invalid store name. Please check and try again.');
          setPasswordError(''); 
        } else if (data.error === 'Invalid password') {
          setPasswordError('Invalid password. Please check and try again.');
          setStoreNameError(''); 
        }
      } else {
        console.log('Login failed. Please check your credentials and try again.');
        setStoreNameError(''); 
        setPasswordError(''); 
      }
    } catch (error) {
      console.error('Login failed:', error);
      setStoreNameError(''); 
      setPasswordError(''); 
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setStoreNameError('');
    setPasswordError('');
    login(storeName, password);
  };

  return (
    <div className="background">
      <div className="container d-flex align-items-center justify-content-center">
        <div className="sign-page">
          <Link>
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
              <Form.Control.Feedback type="invalid">
                {storeNameError}
              </Form.Control.Feedback>
            </div>

            <div className="form-group mb-3">
              <Form.Label className="input-title">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                isInvalid={!!passwordError}
                className="custom-placeholder"
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </div>

            <button className="mt-5 btn btn-primary w-100 mb-3" style={{ backgroundColor: '#17CC82', borderColor: 'transparent' }} type="submit">
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
