import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Home() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getHomePage() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/home`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPlugins(data);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error retrieving home page:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      getHomePage();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const updatePluginStatus = async (pluginId, isActive) => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/api/togglePlugin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({ id: pluginId, isActive })
      });

      if (response.ok) {
        const updatedPlugin = await response.json();
        setPlugins(prevPlugins =>
          prevPlugins.map(plugin =>
            plugin.id === pluginId ? updatedPlugin : plugin
          )
        );
        alert(`Plugin ${isActive ? 'activated' : 'deactivated'} successfully.`);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Error updating plugin status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating plugin status:', error);
      alert('Error updating plugin status. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background">
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Your Plugins</h2>
        <ul className="list-group">
          {plugins.length > 0 ? (
            plugins.map((plugin, index) => (
              <li key={plugin.id} className="list-group-item d-flex justify-content-between align-items-center">
                {plugin.name}
                <div className="switch-wrapper">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={plugin.isActive}
                      onChange={(e) => updatePluginStatus(plugin.id, e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item">No plugins available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Home;
