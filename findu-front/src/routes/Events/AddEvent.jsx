import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddEvent.css';
import mainImg from '../../images/Cargar_img_portada.png'
import addImg from '../../images/Cargar_img_adicional.png'


function App() {
    const [isEventSaved, setIsEventSaved] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();

    const [mainFile, setMainFile] = useState(null);
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [name, setName] = useState('');
    const [selectedEventType, setSelectedEventType] = useState('');
    const [eventTypes, setEventTypes] = useState([]);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const formattedStartDate = startDate.split('/').reverse().join('-');
    const formattedEndDate = endDate.split('/').reverse().join('-');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');
    const [street, setStreet] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [pricePerTicket, setPricePerTicket] = useState('');
    const [ticketsEnabledPerDay, setTicketsEnabledPerDay] = useState('');
    const [policy1Name, setPolicy1Name] = useState('');
    const [policy1Description, setPolicy1Description] = useState('');
    const [policy2Name, setPolicy2Name] = useState('');
    const [policy2Description, setPolicy2Description] = useState('');
    const [policy3Name, setPolicy3Name] = useState('');
    const [policy3Description, setPolicy3Description] = useState('');
    const [selectedFeature, setSelectedFeature] = useState([]);
    const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);
    const [features, setFeatures] = useState([]);
    const [activeIcon, setActiveIcon] = useState(null);


    useEffect(() => {
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/event-types/all`)
            .then(response => response.json())
            .then(data => {
                setEventTypes(data); // Establece los tipos de evento en el estado
            })
            .catch(error => {
                console.error('Error fetching event types:', error);
            });
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/countries/all`)
            .then(response => response.json())
            .then(data => {
                setCountries(data); // Establece la lista de países en el estado
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/features/all`)
            .then(response => response.json())
            .then(data => {
                console.log('Data de características recibida:', data);
                setFeatures(data); // Establece los datos de características en el estado
                // Obtén los IDs de las características seleccionadas si ya tienes esa información desde otro lugar
                // setSelectedFeatureIds([1, 3, 5]); // Reemplaza con los IDs reales
            })
            .catch(error => {
                console.error('Error fetching features:', error);
            });
    }, []);


    const handleMainFileChange = (event) => {
        setMainFile(event.target.files[0]);
    };

    const handleAdditionalFilesChange = (event) => {
        setAdditionalFiles([...event.target.files]);
    };

    const handleUpload = () => {
        // Validación de campos obligatorios
        if (
            !name ||
            !selectedEventType ||
            !description ||
            !startDate ||
            !endDate ||
            !openingTime ||
            !closingTime ||
            !street ||
            !selectedCountry ||
            !pricePerTicket ||
            !ticketsEnabledPerDay ||
            !mainFile ||
            !policy1Name ||
            !policy1Description ||
            !policy2Name ||
            !policy2Description ||
            !policy3Name ||
            !policy3Description ||
            !selectedFeature
        ) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        const formData = new FormData();
        formData.append('file1', mainFile);
        formData.append('active', true);

        for (let i = 0; i < additionalFiles.length; i++) {
            formData.append('additionalFiles', additionalFiles[i]);
        }

        console.log(selectedFeature)
        for (let i = 0; i < selectedFeature.length; i++) {
            const featureId = parseInt(selectedFeature[i], 10); // Convierte el ID a un entero base 10
            formData.append('features', featureId);
        }

        formData.append('name', name);
        formData.append('eventType', selectedEventType);
        formData.append('description', description);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('startDate', formattedStartDate);
        formData.append('endDate', formattedEndDate);
        formData.append('openingTime', openingTime);
        formData.append('closingTime', closingTime);
        formData.append('street', street);
        formData.append('country', selectedCountry);
        formData.append('pricePerTicket', pricePerTicket);
        formData.append('ticketsEnabledPerDay', ticketsEnabledPerDay);
        formData.append('policy1Name', policy1Name);
        formData.append('policy1Description', policy1Description);
        formData.append('policy2Name', policy2Name);
        formData.append('policy2Description', policy2Description);
        formData.append('policy3Name', policy3Name);
        formData.append('policy3Description', policy3Description);


        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al guardar el evento. Por favor, intenta nuevamente.');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setIsEventSaved(true);
                setShowSuccessPopup(true);
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.response) {
                    error.response.json().then(serverError => {
                        console.error('Mensaje de error del servidor:', serverError);
                        setIsEventSaved(false);
                    }).catch(parseError => {
                        console.error('Error al analizar la respuesta del servidor:', parseError);
                        setIsEventSaved(false);
                    });
                } else {
                    setIsEventSaved(false);
                }
            });
    };

    const handlePopupConfirm = () => {
        setShowSuccessPopup(false); // Cerrar el popup
        navigate('/adminEvent'); // Redirigir a /adminEvent
    };

    const toggleSelectedFeature = (featureId) => {
        if (selectedFeature.includes(featureId)) {
            setSelectedFeature(prevSelected => prevSelected.filter(id => id !== featureId));
        } else {
            // Si el ícono no está seleccionado, agrégalo a la lista de selección
            setSelectedFeature(prevSelected => [...prevSelected, featureId]);
        }
        setActiveIcon(featureId);
    };



    return (
        <div className="main-container">
            <div className='form-container'>
                <h3 className='add_event'>Agregar evento</h3>
                <div className="form">
                    <div className="column">
                        <div className="inputbox">
                            <label htmlFor="name">Nombre del evento</label>
                            <input type="text" className='input-field' placeholder="Escribe un nombre del evento..." onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="inputbox">
                            <label htmlFor="startDate">Fecha de inicio</label>
                            <input type="date" className='input-field' onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="inputbox">
                            <label htmlFor="endDate">Fecha de cierre</label>
                            <input type="date" className='input-field' onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="inputbox">
                            <label htmlFor="street">Dirección</label>
                            <input type="text" className='input-field' placeholder="Escribe la direccion del evento..." onChange={(e) => setStreet(e.target.value)} />
                        </div>
                        <div className="inputbox">
                            <label htmlFor="pricePerTicket">Valor del ticket</label>
                            <input type="number" className='input-field' placeholder="$**" onChange={(e) => setPricePerTicket(e.target.value)} />
                        </div>
                    </div>

                    <div className="column">
                        <div className="inputbox">
                            <label htmlFor="eventType">Tipo de Evento</label>
                            <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}>
                                <option value="">Elije un tipo de evento...</option>
                                {eventTypes.map(eventType => (
                                    <option key={eventType.id} value={eventType.id}>
                                        {eventType.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="inputbox">
                            <label className='features' htmlFor="features">Características</label>
                            <div className='contenedor-iconos'>
                                <div className="add-icon-container">
                                    {features.map(feature => {
                                        const isActive = selectedFeatureIds.includes(feature.id);
                                        const isHovered = activeIcon === feature.id;
                                        return (
                                            <div
                                                key={feature.id}
                                                className={`icon-option ${isActive ? 'selected' : ''}`}
                                                onClick={() => toggleSelectedFeature(feature.id)}
                                                onMouseEnter={() => setActiveIcon(feature.id)}
                                                onMouseLeave={() => setActiveIcon(null)}
                                            >
                                                <img
                                                    src={`https://gr6.s3.amazonaws.com/i/${feature.iconCode}.svg`}
                                                    alt={feature.name}
                                                    className={`icon-preview ${isActive ? '' : 'inactive-icon'}`}
                                                />
                                                {isHovered && (
                                                    <div className="icon-name">{feature.name}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="selected-features">
                            <p>Características seleccionadas:</p>
                            <ul>
                                {selectedFeature.map((featureId) => {
                                    const feature = features.find((f) => f.id === featureId);
                                    return <li key={featureId}>{feature ? feature.name : 'Característica no encontrada'}</li>;
                                })}
                            </ul>
                        </div>


                        <div className="inputbox">
                            <label className='hour' htmlFor="openingTime">Hora de inicio</label>
                            <input type="time" className='input-field' onChange={(e) => setOpeningTime(e.target.value)} />
                        </div>
                        <div className="inputbox">
                            <label htmlFor="closingTime">Hora de cierre</label>
                            <input type="time" className='input-field' onChange={(e) => setClosingTime(e.target.value)} />
                        </div>
                        <div className="inputbox">
                            <label htmlFor="country">País</label>
                            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                <option value="">Elije un país...</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="inputbox">
                            <label htmlFor="ticketsEnabledPerDay">Tickets por día</label>
                            <input type="number" className='input-field' placeholder="Ingresa los tickets disponibles..." onChange={(e) => setTicketsEnabledPerDay(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className='form'>
                    <div className="description-box">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            className="input-field"
                            placeholder="Describe el evento..."
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="img_alta_producto">
                        <label htmlFor="mainFileInput" className="image-upload-label">
                            <img src={mainImg} alt="Cargar imagen de portada" />
                        </label>
                        <input
                            type="file"
                            id="mainFileInput"
                            style={{ display: "none" }}
                            onChange={handleMainFileChange}
                        />

                        <label htmlFor="additionalFilesInput" className="image-upload-label">
                            <img src={addImg} alt="Cargar imágenes adicionales" />
                        </label>
                        <input
                            type="file"
                            id="additionalFilesInput"
                            style={{ display: "none" }}
                            multiple
                            onChange={handleAdditionalFilesChange}
                        />
                    </div>

                    <h4 className="add_event">Políticas y condiciones del evento</h4>

                    <div className="column">
                        <div className="inputbox">
                            <label htmlFor="policy1Name">Nombre de la política 1</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Escribe el título de la política 1..."
                                onChange={(e) => setPolicy1Name(e.target.value)}
                            />
                        </div>

                        <div className="description-box">
                            <label htmlFor="policy1Description">Descripción de la política 1</label>
                            <textarea
                                className="input-field"
                                placeholder="Describe la política 1..."
                                onChange={(e) => setPolicy1Description(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="column">
                        <div className="inputbox">
                            <label htmlFor="policy2Name">Nombre de la política 2</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Escribe el título de la política 2..."
                                onChange={(e) => setPolicy2Name(e.target.value)}
                            />
                        </div>

                        <div className="description-box">
                            <label htmlFor="policy2Description">Descripción de la política 2</label>
                            <textarea
                                className="input-field"
                                placeholder="Describe la política 2..."
                                onChange={(e) => setPolicy2Description(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="column">
                        <div className="inputbox">
                            <label htmlFor="policy3Name">Nombre de la política 3</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Escribe el título de la política 3..."
                                onChange={(e) => setPolicy3Name(e.target.value)}
                            />
                        </div>

                        <div className="description-box">
                            <label htmlFor="policy3Description">Descripción de la política 3</label>
                            <textarea
                                className="input-field"
                                placeholder="Describe la política 3..."
                                onChange={(e) => setPolicy3Description(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="column button-column">
                    <button onClick={handleUpload} className="add-button save-button">
                        Guardar evento
                    </button>
                    </div>

                    {showSuccessPopup && (
                        <div className="popup">
                            <p>El evento se ha agregado exitosamente.</p>
                            <div className="button-container">
                                <button onClick={handlePopupConfirm}>Aceptar</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default App;