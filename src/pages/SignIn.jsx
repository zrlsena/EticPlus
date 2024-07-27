import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config';
import axios from 'axios';
import { packageData } from '../components/PackageData';

const SignIn = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [storeError, setStoreError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const apiUrl = 'https://bilir-d108588758e4.herokuapp.com/login';

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {
        setStoreName(response.data.storeName);
        setPassword(response.data.password);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        storeName,
        password,
      });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        navigate('/login'); // Başarılı girişten sonra yönlendirme
      } else {
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    setStoreNameError('');
    setPasswordError('');
    setStoreError('');
    setPackageError('');

    if (storeName.length < 3 || storeName.length > 20) {
      setStoreNameError('StoreName must be between 3 and 20 characters.');
      isValid = false;
    }

    if (password.length < 4 || password.length > 15) {
      setPasswordError('Password must be between 4 and 15 characters.');
      isValid = false;
    }

    if (selectedStore === '') {
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

  const handleUpdate = () => {

    const postData = { storeName, password };
    axios.post(apiUrl, postData)
      .then(response => console.log('Data updated successfully:', response.data))
      .catch(error => console.error('Error posting data:', error));
  };

  return (
    <div className='background'>
      <img className="img"src="/images/SignupBackground.png"/>
      <div className="sign-in-page">
      <img className="logo"src="/images/eticLogo.png"/>
      
        <div className="welcome-section">
          <h1>Welcome to EticPlus</h1>
          <p>Continue your mobile journey with us!</p>
          <img src="/images/eticSignup.png" alt="Etic PLUS Logo" />
        </div>

        <form onSubmit={handleSignIn} className="sign-in-form">
          <h1>Sign Up</h1>

          <div className='input'>
            <div>
              <p>Store Name</p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                minLength="3"
                maxLength="20"
              />
              {storeNameError && <p className="error">{storeNameError}</p>}
            </div>

            <div>
              <p>Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="4"
                maxLength="15"
              />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
          </div>

          <div className="dropdown">
            <p>Type of Store</p>
            <button type="button" onClick={toggleDropdown} className="dropdown-button">
              {selectedStore || 'Select a store'}
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

          <h2 className='package-h2'>Choose Your Plan</h2>
          {packageError && <p className="error">{packageError}</p>}

          <div className='package'>
            {packageData.map(pkg => (
              <div key={pkg.value} >
                <label >
                  <input 
                    type="radio"
                    value={pkg.value}
                    checked={selectedPackage === pkg.value}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    class="package-radio"
                  />
                  <div class="package-content">
                    <h1>{pkg.title}</h1>
                    <p>{pkg.description}</p>
                    <ul>
                      {pkg.list && pkg.list.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className='signin-button'
            onClick={handleUpdate}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
