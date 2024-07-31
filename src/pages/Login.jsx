import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://bilir-d108588758e4.herokuapp.com/api/login', {
        storeName,
        password
      });
  
      console.log('Login response:', response.data); // Yanıtı kontrol edin
  
      if (response.data.success) {
        navigate('/profile');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };

  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='background'>
      <img className="img" src="/images/SignupBackground.png" alt="Welcome" />

      <div className="sign-page">
        <Link to="/">
          <img className="logo" src="/images/eticLogo.png" alt="Etic PLUS Logo" />
        </Link>

        <div className="welcome-section">
          <img src="/images/welcomeback.png" alt="Welcome Back" />
        </div>

        <form onSubmit={handleLogin} className="sign-form">
          <h3>Sign In</h3>
          <div className='login-input'>
            <div>
              <p>Store Name</p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder='Enter your store name'
              />
            </div>

            <div className='password-container'>
              <p>Password</p>
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
              />
              <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button className='login-button' type="submit">Sign In</button>
          <p className='question'>Don't have an account?<Link to="/signup">  Sign up!</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
