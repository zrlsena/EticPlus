import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Home() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPackageType, setUserPackageType] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');


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
        setPlugins(data || []);
        setUserPackageType(data.userPackageType || '');
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

  const updatePluginStatus = async (pluginName, isActive) => {
    if (pluginName === "My Page" && isActive) {
      console.log('"My Page" eklentisi devre dışı bırakılamaz.');
      return;
    }

    const jwt = localStorage.getItem('jwt');
    const activePluginCount = plugins.filter(plugin => plugin.active && plugin.name !== 'My Page').length;

    if ((userPackageType === 'SILVER' || userPackageType === 'GOLD') && activePluginCount >= 4 && !isActive) {
      console.log('Silver ve Gold paketlerde sadece 4 eklenti aktif olabilir.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/togglePlugin?pluginName=${pluginName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setPlugins(prevPlugins =>
          prevPlugins.map(plugin =>
            plugin.name === pluginName ? { ...plugin, active: !plugin.active } : plugin
          )
        );
        console.log(`Plugin ${isActive ? 'deactivated' : 'activated'} successfully.`);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        setErrorMessage('You cannot activate more than 3 integrations. Change to Platinum to be able to active more than 3 integrations at the same time');
      }
    } catch (error) {
      console.error('Error updating plugin status:', error);
      setErrorMessage('You cannot activate more than 3 integrations. Change to Platinum to be able to active more than 3 integrations at the same time');
    }
  };

  useEffect(() => {
    if (plugins && plugins.length > 0) {
      let newErrorMessage = '';
      plugins.forEach(plugin => {
        const toggleButton = document.getElementById(`toggle-${plugin.name}`);
        const activePluginCount = plugins.filter(p => p.active && p.name !== 'My Page').length;

        if ((userPackageType === 'SILVER' || userPackageType === 'GOLD') && activePluginCount >= 4 && !plugin.active && plugin.name !== 'My Page') {
          newErrorMessage = 'Silver ve Gold paketlerde sadece 4 eklenti aktif olabilir.';
          setErrorMessage('You cannot activate more than 3 integrations. Change to Platinum to be able to active more than 3 integrations at the same time'); // Hata mesajını ayarla

          toggleButton.disabled = true;
        } else {
          toggleButton.disabled = false;
        }
      });
      console.log('New Error Message:', newErrorMessage);
      setErrorMessage(newErrorMessage);
    }
  }, [plugins, userPackageType]);



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background" >
      <Navbar />
      <div className="container mt-4">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
            position: 'relative',
          }}>

          <h2 className="text-start mb-3 mt-4" style={{ width: '90%', paddingLeft: '30px', fontSize: '36px', fontWeight: 'bold' }}>Integrations </h2>



          <ul className="list-group" style={{ border: '4px solid #007AFF', borderRadius: '36px', width: '90%', position: 'relative' }}>
            <img src="/images/home.png" class="float-end" alt="Etic PLUS Logo" style={{ position: 'absolute', top: '-122px', right: '40px', width: '80px', }} />

            {plugins.length > 0 ? (
              plugins.map((plugin, index) => (
                <li key={plugin.name} className="list-group-item d-flex justify-content-between align-items-center p-3 ps-4 pe-4" style={{
                  fontSize: '18px',
                  opacity: '0.7',
                  borderTopLeftRadius: index === 0 ? '36px' : '0',
                  borderTopRightRadius: index === 0 ? '36px' : '0',
                  borderBottomLeftRadius: index === plugins.length - 1 ? '36px' : '0',
                  borderBottomRightRadius: index === plugins.length - 1 ? '36px' : '0',
                  border: 'none',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                }}>
                  {plugin.name}
                  <div className="switch-wrapper">
                    <label className="switch">
                      <input
                        id={`toggle-${plugin.name}`}
                        type="checkbox"
                        checked={plugin.active}
                        onChange={() => updatePluginStatus(plugin.name, plugin.active)}
                      />
                      <span className={`slider round ${plugin.active ? 'checked' : ''}`}></span>
                    </label>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item">No plugins available</li>
            )}
          </ul>

          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show  mt-3" role="alert" style={{ width: '100%',height:'auto',marginLeft:'15px',paddingBottom:'0px',color:'white', maxWidth: '980px', margin: '0 auto', borderRadius: '28px', fontSize: '14px' , backgroundColor:'#EA493F' }}>
              <p>
      You cannot activate more than 3 integrations.<br />
      Change to <strong>Platinum </strong>to be able to activate more than 3 integrations at the same time.</p>
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ width: '8px', height: '8px', fontSize: '12px', marginRight:'10px',color:'white' }} 
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setErrorMessage(false)}
              ></button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;
