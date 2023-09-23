import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddFeature.css';
import iconData from '../../utils/icondata';


function AddFeature() {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [isFeatureAdded, setIsFeatureAdded] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleIconChange = (iconCode) => {
    setSelectedIcon(iconCode);
  };

  const handleUpload = () => {
    if (!name || !selectedIcon) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const requestData = {
      name: name,
      iconCode: selectedIcon
    };

    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/features`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar la característica. Por favor, intenta nuevamente.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setIsFeatureAdded(true);
        setShowSuccessPopup(true);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsFeatureAdded(false);
      });
  };
  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    navigate('/adminFeatures');
  };

  return (
    <div className='form-container'>
      <div className='add-feature'>
        <h3>Añadir nueva característica</h3>
        <div className="form">
          <div className="input-box">
            <label className='title' htmlFor="name">Nombre de la Característica</label>
            <input type="text" className='input-field' placeholder="Nombre de la característica..." onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='title'> Elige un ícono </div>
          <div className="icon-container">
            {iconData.map(icon => (
              <div
                key={icon.code}
                className={`icon-option ${selectedIcon === icon.code ? 'selected' : ''}`}
                onClick={() => handleIconChange(icon.code)}
              >
                <img src={`https://gr6.s3.amazonaws.com/i/${icon.code}.svg`} alt={icon.label} className="icon-preview" />
              </div>
            ))}

          </div>
        </div>
        <button onClick={handleUpload} className='guardar-button'>Guardar Cambios</button>
        {showSuccessPopup && (
          <div className="popup">
            <p>La característica se ha agregado exitosamente.</p>
            <div className="button-container">
              <button onClick={handlePopupConfirm}>Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFeature;
