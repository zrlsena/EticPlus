import React, { useState } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import Navbar from './Navbar';
import Modal from './Modal';
import API_BASE_URL from '../config';



const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStore, setSelectedStore] = useState('Select a store');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [storeError, setStoreError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  


  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        
      } else {
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };



  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setStoreError('');
    setPackageError('');

    if (username.length < 3 || username.length > 20) {
      setUsernameError('Username must be between 3 and 20 characters.');
      isValid = false;
    }

    if (password.length < 4 || password.length > 15) {
      setPasswordError('Password must be between 4 and 15 characters.');
      isValid = false;
    }

    if (selectedStore === 'Select a store') {
      setStoreError('Please select a store.');
      isValid = false;
    }

    if (!selectedPackage) {
      setPackageError('Please select a package.');
      isValid = false;
    }

    return isValid;
  };


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setIsDropdownOpen(false);
  };

  const isFormValid = username && password && selectedStore !== 'Select a store' && selectedPackage;


if (isFormValid) {

  setTimeout(() => {
    navigate('/login');
  }, 2000);
}

return (
  <body className="signin" >
    <Navbar />
    <form onSubmit={handleSignIn} className="wrapper">
      <h1>Sign In</h1>

      <div className="dropdown-container">
        <button type="button" onClick={toggleDropdown} className="dropdown-button">
          {selectedStore}
        </button>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            <li onClick={() => handleStoreSelect('Store 1')}>Store 1</li>
            <li onClick={() => handleStoreSelect('Store 2')}>Store 2</li>
            <li onClick={() => handleStoreSelect('Store 3')}>Store 3</li>
          </ul>
        )}
        {storeError && <p className="error">{storeError}</p>}
      </div>

      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength="3"
          maxLength="20"
          placeholder='User Name'
        />
        {usernameError && <p className="error">{usernameError}</p>}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="4"
          maxLength="15"
          placeholder='Password'
        />
        {passwordError && <p className="error">{passwordError}</p>}
      </div>

      <div className='package'>
        <label>
          <input
            type="radio"
            value="Silver"
            checked={selectedPackage === 'Silver'}
            onChange={(e) => setSelectedPackage(e.target.value)}
          />
          Silver
        </label>
        <label>
          <input
            type="radio"
            value="Gold"
            checked={selectedPackage === 'Gold'}
            onChange={(e) => setSelectedPackage(e.target.value)}
          />
          Gold
        </label>
        <label>
          <input
            type="radio"
            value="Premium"
            checked={selectedPackage === 'Premium'}
            onChange={(e) => setSelectedPackage(e.target.value)}
          />
          Premium
        </label>
        {packageError && <p className="error">{packageError}</p>}
      </div>

      <button
        type="submit"
        className='signin-button'
        onClick={() => {
          /*fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })*/

          
        }}
      >
        Sign In
      </button>

    </form>
  </body>
);
};
export default SignIn;
