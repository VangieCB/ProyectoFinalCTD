import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddCat.css';
import mainImg from '../../images/Cargar_img_portada.png'

function AddCat() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isCategoryAdded, setIsCategoryAdded] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!name || !description || !image) {
            alert('Por favor completa todos los campos.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('file1', image);

        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/event-types`, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar la categoría. Por favor, intenta nuevamente.');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setIsCategoryAdded(true);
                setShowSuccessPopup(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsCategoryAdded(false);
            });
    };

    const handlePopupConfirm = () => {
        setShowSuccessPopup(false); // Cerrar el popup
        navigate('/adminCat'); // Redirigir a /adminCat
    };


    return (
        <div className='form-container'>
            <div className='add-cat'>
                <h3>Agregar Nueva Categoría</h3>
                <div className="form">
                    <div className="input-box">
                        <label className='title' htmlFor="name">Nombre de la Categoría</label>
                        <input type="text" className='input-field' onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-box field">
                        <label className='title' htmlFor="description">Descripción</label>
                        <textarea className='input-field' onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <div className="image-upload-box">
                    <label htmlFor="imageInput" className="image-upload-label">
                        <img src={mainImg} alt="Cargar imagen de Categoria" className="image-preview" />
                    </label>
                    <input
                        type="file"
                        id="imageInput"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                </div>

                <button onClick={handleUpload} className='add-button guardar-button'>Guardar Cambios</button>
                {showSuccessPopup && (
                    <div className="popup">
                        <p>La categoría se ha agregado exitosamente.</p>
                        <div className="button-container">
                        <button onClick={handlePopupConfirm}>Aceptar</button>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

export default AddCat;
