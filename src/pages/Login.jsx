import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password
      });

      if (response.data.success) {
        // Başarıyla giriş yaptıktan sonra yönlendirme yap
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className='background'>
      <img className="img" src="/images/SignupBackground.png" />

      <div className="sign-page">
        <Link to="/">
          <img className="logo" src="/images/eticLogo.png" alt="Etic PLUS Logo" />
        </Link>

        <div className="welcome-section">
          <h1>Welcome to EticPlus</h1>
          <p>Continue your mobile journey with us!</p>
          <img src="/images/eticlogin.png" alt="Etic PLUS Logo" />
        </div>

        <form onSubmit={handleLogin} className="sign-form">
          <h3>Login</h3>
          <div className='login-input'>
            <div>
              <p>Store Name</p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                
              />
            </div>

            <div>
              <p>Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>


          <p className='question'>Don't have an account?<a href="/signup">  Sign up!</a></p>
          <button className='login-button' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
