import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/EditEvent.css';

function EditEvent() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL

    const [isEventUpdated, setIsEventUpdated] = useState(false);
    const [selectedEventTypeEdit, setSelectedEventTypeEdit] = useState('');
    const [eventTypes, setEventTypes] = useState([]);
    const [eventData, setEventData] = useState({});

    useEffect(() => {
        // Obtener los tipos de evento del servidor
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/event-types/all`)
            .then(response => response.json())
            .then(data => {
                setEventTypes(data);
            })
            .catch(error => {
                console.error('Error fetching event types:', error);
            });

        // Obtener los datos del evento
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events/${id}`)
            .then(response => response.json())
            .then(data => {
                setEventData(data);
                setSelectedEventTypeEdit(data.eventType.id); // Establece el ID del tipo de evento seleccionado
            })
            .catch(error => {
                console.error('Error fetching event data:', error);
            });
    }, [id]);

    const handleUpdate = () => {
        if (!selectedEventTypeEdit) {
            alert('Por favor elige un nuevo tipo de evento.');
            return;
        }

        const updateData = {
            eventType: {
                id: selectedEventTypeEdit
            }
        };

        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el evento. Por favor, intenta nuevamente.');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setIsEventUpdated(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsEventUpdated(false);
            });
    };
    console.log("eventData:", eventData); // Agrega un log para verificar el estado eventData

    return (
        <div className='form-container'>
            <h3 className='edit_event'>Editar evento</h3>
            <div className="form">
                <div className="column">
                    {/* Campo eventType */}
                    <div className="inputbox">
                        <label htmlFor="eventType">Tipo de Evento</label>
                        <select
                            value={selectedEventTypeEdit}
                            onChange={(e) => setSelectedEventTypeEdit(e.target.value)}
                        >
                            <option value="">Elije un tipo de evento...</option>
                            {eventTypes.map(eventType => (
                                <option key={eventType.id} value={eventType.id}>
                                    {eventType.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Agrega los otros campos con readOnly */}
                    <div className="inputbox">
                        <label htmlFor="name">Nombre del evento</label>
                        <input type="text" className='input-field' value={eventData.name || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="startDate">Fecha de inicio</label>
                        <input type="date" className='input-field' value={eventData.startDate || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="endDate">Fecha de cierre</label>
                        <input type="date" className='input-field' value={eventData.endDate || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="street">Dirección</label>
                        <input type="text" className='input-field' value={eventData.street || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="pricePerTicket">Valor del evento</label>
                        <input type="number" className='input-field' value={eventData.pricePerTicket || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="openingTime">Hora de inicio</label>
                        <input type="time" className='input-field' value={eventData.openingTime || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="closingTime">Hora de cierre</label>
                        <input type="time" className='input-field' value={eventData.closingTime || ''} readOnly />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="country">País</label>
                        <input
                            type="text"
                            className='input-field'
                            value={eventData.country?.name || ''}
                            readOnly
                        />
                    </div>
                    <div className="inputbox">
                        <label htmlFor="ticketsEnabledPerDay">Cantidad de tickets</label>
                        <input type="number" className='input-field' value={eventData.ticketsEnabledPerDay || ''} readOnly />
                    </div>
                    <div className="description-box">
                        <label htmlFor="description">Descripción</label>
                        <textarea className='input-field' value={eventData.description || ''} readOnly />
                    </div>
                </div>
                <button onClick={handleUpdate} className='update-button'>Actualizar evento</button>
                {isEventUpdated && (<p>El evento se ha actualizado exitosamente.</p>)}
            </div>
        </div>
    )
}

export default EditEvent;
