import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Login.css';
import Navbar from './Navbar';

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
    <body>
      <Navbar/>
    <div className="wrapper">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='User Name'
            
          />
        </div>
        <div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
        </div>
        <p>Don't have an account?<a href="/signin">  Sign up!</a></p>
        <button type="submit">Login</button>
      </form>
    </div>
    </body>
  );
};

export default Login;
