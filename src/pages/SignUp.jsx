import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import axios from 'axios';
import { packageData } from '../components/PackageData';

const SignUp = () => {
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [packageType, setPackageType] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [packageError, setPackageError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);
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



  const validateForm =async () => {
    let isValid = true;
    setStoreNameError('');
    setPasswordError('');
    setCategoryError('');
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

    if (!selectedCategory) { // selectedCategory olarak güncellendi
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

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName); // seçilen kategori adı
    setIsDropdownOpen(false);
  };

  const handleUpdate = () => {

    const postData = {
      storeName,
      category: selectedCategory, 
      password,
      packageType
    };
    axios.post(apiUrl, postData)
      .then(response => console.log('Data updated successfully:', response.data))
      .catch(error => console.error('Error posting data:', error));
  };
  

  return (
    <div className='background'>
      <img className="img" src="/images/SignupBackground.png" alt="Welcome" />

      <div className="sign-page">
        <Link to="/">
          <img className="logo" src="/images/eticLogo.png" alt="Etic PLUS Logo" />
        </Link>

        <div className="welcome-section">
          <img src="/images/signupWelcome.png" alt="Etic PLUS Logo" />
        </div>

        <form onSubmit={handleSignIn} className="sign-form">
          <h1>Sign Up</h1>

          <div className='input'>
            <div >
              <p>Store Name</p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                minLength="3"
                maxLength="20"
                placeholder='Between 3 and 20 characters'
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
                placeholder='Create strong password'
              />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
          </div>

          <div className="dropdown">
            <p>Type of Store</p>
            <button type="button" onClick={toggleDropdown} className={`dropdown-button ${isDropdownOpen ? 'open' : ''}`}
              ref={dropdownButtonRef}
              >
              {selectedCategory || 'Select a store category'}
              <img src="/images/dropdown.png" alt="dropdown" />
            </button>
            {!isDropdownOpen && categoryError && <p className="error">{categoryError}</p>}
            {isDropdownOpen && (
              <ul className={`dropdown-menu`} ref={dropdownMenuRef}>
                {categories.map((item, index) => ( // category yerine categories kullanın
                  <li key={index} onClick={() => handleCategorySelect(item.name)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div className='package-h2'>
            <h2 >Choose Your Plan</h2>

          </div>
          <div className='package'>
            {packageData.map(pkg => (
              <div className='wrapper' key={pkg.value}  >
                <label >
                  <input
                    type="radio"
                    value={pkg.value}
                    checked={packageType === pkg.value}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="package-radio"
                  />
                  <div className="package-content">
                    <h1>{pkg.title}</h1>
                    <p dangerouslySetInnerHTML={{ __html: pkg.description.replace('**', '<strong>').replace('**', '</strong>') }} />
                    <ul>
                      {pkg.list && pkg.list.map((item, index) => (
                        <li key={index}>
                          {item}
                          {pkg.value === 'PLATINUM' && (
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
          <p className='question'>Already have a store? <a href="/login">  Login.</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
