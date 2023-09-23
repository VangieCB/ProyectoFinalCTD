import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import '../../styles/EditFeature.css'

const iconData = [
  { code: 'cup', label: 'Copa de campeones' },
  { code: 'dis', label: 'Señor silla de ruedas' },
  { code: 'strs', label: '3 estrellas' },
  { code: 'bed', label: 'Cama azul' },
  { code: 'buk', label: 'Libro' },
  { code: 'bedf', label: 'Fuera de cama, cama inclinada' },
  { code: 'brgt', label: 'Brillo sol y luna adentro' },
  { code: 'sol', label: 'Sol' },
  { code: 'blnd', label: 'Ciego o señor con bastón' },
  { code: 'wif', label: 'Bluetooth o Wi-Fi' },
  { code: 'calnd', label: 'Calendario repetir' },
  { code: 'tatr', label: 'Teatro' },
  { code: 'liqr', label: 'Licor' },
  { code: 'dog', label: 'Perro' },
  { code: 'nodg', label: 'Prohibido perro' },
  { code: 'out', label: 'Aire libre, montaña' },
  { code: 'evnt', label: 'Se repite evento calendario' },
  { code: 'slct', label: 'Dedo seleccionando ícono' },
  { code: 'phto', label: 'Cámara fotográfica' },
  { code: 'clean', label: 'Lavarse las manos' },
  { code: 'car', label: 'Auto o carro' },
  { code: 'bbcr', label: 'Stroller o carrito de bebé' },
  { code: 'hous', label: 'Casa con chimenea' },
  { code: 'nocrd', label: 'No usar tarjeta para pago' },
  { code: 'card', label: 'Pago con tarjeta' },
  { code: 'bike', label: 'Bicicleta' },
  { code: 'run', label: 'Persona corriendo' },
  { code: 'tren', label: 'Tren' },
  { code: 'wc', label: 'Hombre y mujer símbolo de baños' },
  { code: 'wc2', label: 'Baño orinal' },
  { code: 'eat', label: 'Cubiertos' },
  { code: 'noeat', label: 'Cubiertos tachados prohibido' },
  { code: 'nomny', label: 'No dinero signo pesos tachado' },
  { code: 'old', label: 'Viej@ ancian@' },
  { code: 'pwer', label: 'Enchufe energía conexión' },
  { code: 'fmly', label: 'Familia' },
  { code: 'alli', label: 'Señal dirigirse flecha' },
  { code: 'trip', label: 'Aventón o señor con equipaje' },
  { code: 'mny', label: 'Signo pesos' },
  { code: '18ms', label: 'Mayor de 18' },
  { code: 'bby', label: 'Carita de bebé' },
  { code: 'fum', label: 'Cigarrillo' },
  { code: 'nofum', label: 'Cigarrillo tachado' }
];

function EditFeature() {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [isFeatureUpdated, setIsFeatureUpdated] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los datos de la característica a editar
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/features/${id}`)
      .then(response => response.json())
      .then(data => {
        setName(data.name); // Rellena el nombre con los datos actuales
        setSelectedIcon(data.iconCode); // Rellena el ícono con los datos actuales
      })
      .catch(error => {
        console.error('Error fetching feature data:', error);
      });
  }, [id]);

  const handleIconChange = (iconCode) => {
    setSelectedIcon(iconCode);
  };

  const handleUpdate = () => {
    if (!name || !selectedIcon) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const updateData = {
      name: name,
      iconCode: selectedIcon
    };

    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/features/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar la característica. Por favor, intenta nuevamente.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setIsFeatureUpdated(true);
        setShowSuccessPopup(true);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsFeatureUpdated(false);
      });
  };

  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    navigate('/adminFeatures');
  };

  return (
    <div className='form-container'>
      <h3 className='edit-feature'>Editar Característica</h3>
      <div className="form">
        <div className="input-box">
          <label className='title' htmlFor="name">Nombre de la Característica</label>
          <input
            type="text"
            className='input-field'
            value={name}
            onChange={(e) => setName(e.target.value)} // Permitir al usuario modificar el nombre
          />
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
      <button onClick={handleUpdate} className='update-button'>Actualizar Característica</button>
      {showSuccessPopup && (
        <div className="popup">
          <p>La característica se ha actualizado exitosamente.</p>
          <div className="button-container">
            <button onClick={handlePopupConfirm}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditFeature;
