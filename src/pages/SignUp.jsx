import React, { useEffect, useState, useRef  } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config';
import axios from 'axios';
import { packageData } from '../components/PackageData';

const SignUp = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [packageType, setPackageType] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [storeError, setStoreError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownFontSize, setDropdownFontSize] = useState(16); 
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const navigate = useNavigate();

  const apiUrl = 'https://bilir-d108588758e4.herokuapp.com/register';

  const stores = ['General Store','Brand Store','Boutique Store', 'Crafts and Hobby Store', 'Food and Beverage Store','Cosmetics and Personal Care Store','Electronics Store','Home and Garden Store','Sports and Outdoor Store','Books and Music Store','Kids and Baby Store','Category-Specific Store']; 
/*

useEffect(() => {
  axios.get(apiUrl)
    .then(response => {
      setStoreName(response.data.storeName);
      setPassword(response.data.password);
    })
    .catch(error => console.error('Error fetching data:', error));
}, []);

*/
  useEffect(() => {
    if (description.length > 25) {
      setDropdownFontSize(10); 
    } else {
      setDropdownFontSize(16);
    }
  }, [description]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target) && !dropdownButtonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        storeName,
        description,
        password,
        packageType,
      },{
        headers: {
          'Content-Type': 'application/json',
        }
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
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one punctuation mark.');
    }
    if (/\s/.test(password)) {
      setPasswordError('Password must not contain spaces.');
    }

    if (description === '') {
      setStoreError('Please select a store.');
      isValid = false;
    }

    if (!packageType) {
      setPackageError('Please select a package.');
      isValid = false;
    }

    return isValid;
  };

  
  const toggleDropdown = () => {
    if (isDropdownOpen) {
      if (dropdownMenuRef.current) { 
        dropdownMenuRef.current.classList.add('closed');
        dropdownMenuRef.current.classList.remove('open');
      }
      setTimeout(() => {
        setIsDropdownOpen(false);
      }, 500); 
    } else {
      setIsDropdownOpen(true);
      setTimeout(() => {
        if (dropdownMenuRef.current) {
          dropdownMenuRef.current.classList.add('open'); 
        }
      }, 0);
    }
  };

  const handleStoreSelect = (store) => {
    setDescription(store);
    setIsDropdownOpen(false);
  };

  const handleUpdate = () => {

    const postData = {  storeName,
      description,
      password,
      packageType };
    axios.post(apiUrl, postData)
      .then(response => console.log('Data updated successfully:', response.data))
      .catch(error => console.error('Error posting data:', error));
  };

  return (
    <div className='background'>
      <img className="img"src="/images/SignupBackground.png"/>
      
      <div className="sign-page">
      <Link to="/">
          <img className="logo"src="/images/eticLogo.png" alt="Etic PLUS Logo" />
        </Link>
      
        <div className="welcome-section">
          <h1>Welcome to EticPlus</h1>
          <p>Continue your mobile journey with us!</p>
          <img src="/images/eticSignup.png" alt="Etic PLUS Logo" />
        </div>

        <form onSubmit={handleSignIn} className="sign-form">
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

          <div className="dropdown" ref={dropdownMenuRef}>
            <p>Type of Store</p>
            <button type="button" onClick={toggleDropdown} className="dropdown-button" ref={dropdownButtonRef}
              style={{ fontSize: `${dropdownFontSize}px` }}>
              {description || 'Select a store'}
            </button>
            {isDropdownOpen && (
              <ul className={`dropdown-menu`} ref={dropdownMenuRef}>
              {stores.map((store, index) => (
                  <li key={index} onClick={() => handleStoreSelect(store)}>
                    {store}
                  </li>
                ))}
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
                    checked={packageType === pkg.value}
                    onChange={(e) => setPackageType(e.target.value)}
                    class="package-radio"
                  />
                  <div class="package-content">
                    <h1>{pkg.title}</h1>
                    <p dangerouslySetInnerHTML={{ __html: pkg.description.replace('**', '<strong>').replace('**', '</strong>') }} />
                    <ul>
                      {pkg.list && pkg.list.map((item, index) => (
                        <li key={index}>
                          {item}
                          {pkg.value === 'Platinum' && (
                            <span> ✔</span> // Platinum paketine özel tik işareti
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className='sign-button'
            onClick={handleUpdate}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
