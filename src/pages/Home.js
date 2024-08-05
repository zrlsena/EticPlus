import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  async function getHomePage() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('User not authenticated. Please login.');
      navigate('/login'); // Eğer token yoksa giriş sayfasına yönlendir
      return;
    }
    try {
      const response = await axios.get('https://bilir-d108588758e4.herokuapp.com/api/home', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        const plugins = response.data;
        console.log('User plugins:', plugins);
        // Plugin verilerini sayfada göster
      }
    } catch (error) {
      console.error('Error retrieving home page:', error.response.data);
      alert('Error retrieving home page. Please try again.');
    }
  }

  useEffect(() => {
    getHomePage();
  }, []);

  return (
    <div className="background">
      <Navbar />
      {/* Plugin verilerini göstereceğiniz alan */}
    </div>
  );
}

export default Home;
