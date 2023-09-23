import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../styles/EventDetail.css'
import Gps_icon from '../../images/Gps_icon.jpg'
import Hour_Icon from '../../images/Hour_Icon.jpg'
import Ticket_Icon from '../../images/Ticket_Icon.jpg'
import MyProfile from '../MyProfile';
import Calendar_Icon from '../../images/Calendar_Icon.jpg'
import '../../styles/EventReservationDetail.css'

const max_additional_images = 4;

function formatHora(hora) {
  const dateObj = new Date(hora);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatFecha(fecha) {
  const dateObj = new Date(fecha);
  // Establece la hora en formato UTC (ejemplo: 00:00:00 UTC)
  dateObj.setUTCHours(0, 0, 0, 0);
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const year = dateObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

const EventReservationDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedDate = searchParams.get('date');
  const currentTickets = searchParams.get('tickets');
  const [evento, setEvento] = useState({ additionalImages: [], });
  const [hideButton, setHideButton] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false); // Nuevo estado para mostrar el modal de spinner
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);


  useEffect(() => {
    buscarEvento(id);
  }, [id]);

  const buscarEvento = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events/${id}`);
      const eventData = await response.json();
      console.log("API response:", eventData);

      if (eventData.id) {
        setEvento(eventData);

        // Extrae las fechas disponibles de availableTicketsPerDays
        const availableDates = eventData.availableTicketsPerDays.map((ticket) => ticket.date);
        console.log("Fechas disponibles:", availableDates);

      } else {
        console.error("API response does not contain expected event data");
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleBooking = async () => {
    console.log(evento.availableTicketsPerDays);
    console.log(selectedDate);
    console.log(currentTickets);
    setShowSpinner(true);

    let dateInfoSelected = undefined;

    evento.availableTicketsPerDays.forEach(dateInfo => {
      if (dateInfo.date === selectedDate) {
        dateInfoSelected = dateInfo;
      }
    });

    if (dateInfoSelected === undefined ||
      dateInfoSelected.ticketsEnabled - dateInfoSelected.ticketsConsumed - currentTickets < 0) {
      // Muestra el modal de error después de cargar el spinner
      setTimeout(() => {
        setShowSpinner(false);
        showError();
      }, 2000);
      return;
    }

    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/bookings`;
      const user = JSON.parse(localStorage.getItem('dataUser'));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'event': {
            'id': id
          },
          'attendanceDate': selectedDate,
          'tickets': currentTickets
        })
      });

      const data = await response.json();
      console.log('API Booking:', data);
      setHideButton(true);

      // Muestra el modal de confirmación después de cargar el spinner
      setTimeout(() => {
        setShowSpinner(false);
        showConfirmation();
      }, 2000);
    } catch (error) {
      console.error('Error fetching booking:', error)
      // Cierra el modal de spinner después de un tiempo (por ejemplo, 2 segundos)
      setTimeout(() => {
        setShowSpinner(false);
      }, 3000);
    }
  }

  function SpinnerModal() {
    return (
      <div className="modal-background">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Función para mostrar el modal de confirmación
  const showConfirmation = () => {
    setShowConfirmationModal(true);

    // Cierra el modal de confirmación después de 5 segundos
    setTimeout(() => {
      setShowConfirmationModal(false);
    }, 3000);
  };

  // Función para mostrar el modal de error
  const showError = () => {
    setShowErrorModal(true);

    // Cierra el modal de error después de 5 segundos
    setTimeout(() => {
      setShowErrorModal(false);
    }, 3000);
  };

  return (
    <div className='master-container' id='master-container'>
      <div className='event-reservation' id='event-reservation'>
        <div className="card-detail-container" id='card-detail-container'>

          {/* Galería de imágenes */}
          <div className="images-container">
            <div className="img-add-container">
              {evento.additionalImages
                .slice(0, max_additional_images)
                .map((imageUrl, index) => (
                  <img
                    key={index}
                    className="img-add"
                    src={imageUrl}
                    alt={`${evento.name} - Image ${index + 2}`}
                  />
                ))}
            </div>
            <div className="img-main-container">
              <img className="img-main" src={evento.image1} alt={evento.name} />

            </div>
          </div>

          {/* NOMBRE Y DETALLE DEL EVENTO */}
          <div className="detail-section">
            <h3 className="detail-title">{evento.name}</h3>
            <p className="detail-description">{evento.description}</p>
          </div>

          {/* HORARIO DEL EVENTO */}
          <div className="time-section">
            <div className="time-item">
              <img className='icon' src={Hour_Icon} alt="Opening Hour" />
              <div className="date-info">
                <p className="time-title">Hora de inicio:</p>
                <p> {formatHora(evento.startDate + "T" + evento.openingTime)}hs</p>
              </div>
            </div>
            <div className="time-item">
              <div className="date-info">
                <p className="time-title">Hora de cierre:</p>
                <p>{formatHora(evento.startDate + "T" + evento.closingTime)}hs</p>
              </div>
            </div>
          </div>

          {/* DIRECCION */}
          <div className="location-section">
            <img className="location-icon" src={Gps_icon} alt="Location" />
            <div className="location-info">
              <p className="location-title">Dirección:</p>
              <p className="location-value">{evento.street}</p>
            </div>
          </div>

          {/* FECHA SELECCIONADA */}
          <div className="dates-section">
            <div className="date-item">
              <img className='icon' src={Calendar_Icon} alt="Calendar" />
              <div className="date-info">
                <p className="date-title">Fecha Seleccionada: </p>
                <p>{formatFecha(selectedDate)}</p>
              </div>
            </div>
          </div>

          {/* VALOR DEL EVENTO */}
          <div className="price-section">
            <img className="price-icon" src={Ticket_Icon} alt="Price" />
            <div className="price-info">
              <p className="price-title">Valor total a pagar: </p>
              <p className="price-value">${evento.pricePerTicket * currentTickets} </p>
            </div>
          </div>

          {/* CANTIDAD DE TICKETS */}
          <div className="price-section">
            <img className="price-icon" src={Ticket_Icon} alt="Price" />
            <div className="price-info">
              <p className="price-title">Cantidad de tickets: </p>
              <p className="price-value">{currentTickets} </p>
            </div>
          </div>

          {/* Datos Personales */}
          <div className="personal-info-section">

            <h3 className="personal-info-title">Datos personales</h3>
            <div className='myprofile-reservation'>
              <div className='myprofile-avatar'><MyProfile showAvatar={true} showName={false} showEmail={false} showLogoutButton={false} showEditButton={false} /></div>
              <MyProfile showAvatar={false} showName={true} showEmail={false} showLogoutButton={false} showEditButton={false} />
            </div>
            <div className='myprofile-mail'>
              <MyProfile showAvatar={false} showName={false} showEmail={true} showLogoutButton={false} showEditButton={false} />
              </div>
          </div>

          {/* BOTON "Reservar Ahora" */}
          {!hideButton &&
            <button className="reserve-now-button" onClick={handleBooking}>RESERVAR AHORA</button>
          }

          {/* QUE OFRECE EL EVENTO */}
          <div className="features-section">
            <h3 className="features-title">¿Qué ofrece este evento?</h3>
            <div className="features-list">
              {Array.isArray(evento.features) && evento.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">
                    <img src={`https://gr6.s3.amazonaws.com/i/${feature.iconCode}.svg`} alt={feature.name} />
                  </div>
                  <div className="feature-name">{feature.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/*POLITICAS Y CONDICIONES DEL EVENTO */}
          <div className='politics-section'>
            <h3 className='politics-title'> Políticas y condiciones del evento</h3>

            <h4 className='detail-title-policy'>{evento.policy1Name}</h4>
            <p className='detail-description-policy'>{evento.policy1Description}</p>
            <h4 className='detail-title-policy'>{evento.policy2Name}</h4>
            <p className='detail-description-policy'>{evento.policy2Description}</p>
            <h4 className='detail-title-policy'>{evento.policy3Name}</h4>
            <p className='detail-description-policy'>{evento.policy3Description}</p>

          </div>

          {/* Mostrar el modal de spinner si showSpinner es true */}
          {showSpinner && <SpinnerModal />}
          {showConfirmationModal && (
            <div className="confirmation-modal">
              <p>Se ha enviado un correo con la confirmación de la reserva</p>
            </div>
          )}
          {showErrorModal && (
            <div className="confirmation-modal">
              <p>No se puede emitir la reserva</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventReservationDetail;
