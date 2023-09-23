import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../../styles/EventDetail.css'
import Calendar_Icon from '../../images/Calendar_Icon.jpg'
import Gps_icon from '../../images/Gps_icon.jpg'
import iconData from '../../utils/icondata';
import Hour_Icon from '../../images/Hour_Icon.jpg'
import Ticket_Icon from '../../images/Ticket_Icon.jpg'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CustomPopup from '../../utils/CustomPopUp';


const max_additional_images = 4;

const getIconUrl = (iconCode) => {
  const icon = iconData.find((icon) => icon.code === iconCode);
  if (icon) {
    return `https://gr6.s3.amazonaws.com/i/${icon.code}.svg`;
  }

  return 'URL_DE_ICONO_NO_ENCONTRADO';
};

function formatFecha(fecha) {
  const dateObj = new Date(fecha);
  dateObj.setUTCHours(0, 0, 0, 0);
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const year = dateObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatHora(hora) {
  const dateObj = new Date(hora);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function isDateAvailable(date, evento) {
  const selectedDateISO = date.toISOString().split('T')[0];
  let selectedTicketsISO = null;

  for (let i = 0; i < evento.availableTicketsPerDays.length; i++) {
    let dateInfo = evento.availableTicketsPerDays[i];
    if (dateInfo.date === selectedDateISO) {
      selectedTicketsISO = dateInfo;
      break;
    }
  }

  return (
    selectedDateISO >= evento.startDate &&
    selectedDateISO <= evento.endDate &&
    selectedTicketsISO &&
    selectedTicketsISO.ticketsEnabled > selectedTicketsISO.ticketsConsumed
  );
}

function CustomCalendarTile({ date, evento, handleDateClick }) {
  const selectedDateISO = date.toISOString().split('T')[0];

  if (isDateAvailable(date, evento)) {
    console.log(date)
    return null;
  }
  return null;
}


function calcularTicketsDisponibles(selectedTicketsISO) {
  if (selectedTicketsISO) {
    const ticketsEnabled = selectedTicketsISO.ticketsEnabled || 0;
    const ticketsConsumed = selectedTicketsISO.ticketsConsumed || 0;
    let disponibles = ticketsEnabled - ticketsConsumed;
    return disponibles < 5 ? disponibles : 5;
  } else {
    return 0;
  }
}

const EventDetail = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState({ additionalImages: [], availableTicketsPerDays: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedDate, setSelectedDate] = useState()
  const [selectedDateISO, setSelectedDateISO] = useState()
  const [ticketsDisponibles, setTicketsDisponibles] = useState(0);
  const [currentTickets, setCurrentTickets] = useState(0);
  const [showTicketsSoldOutAlert, setShowTicketsSoldOutAlert] = useState(false);

  const [favoritos, setFavoritos] = useState([]);
  const isFavorito = favoritos.includes(evento.id);
  const usuarioActual = JSON.parse(localStorage.getItem("dataUser"));

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupTitle, setPopupTitle] = useState('');

  useEffect(() => {
    buscarEvento(id);
    buscarFavoritos();
  }, [id]);

  const buscarEvento = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events/${id}`);
      const eventData = await response.json();
      console.log("API response:", eventData);

      if (eventData.id) {
        setEvento(eventData);
        // Constantes para sector Calendario
        const parsedStartDate = Date.parse(eventData.startDate);
        const selectedDate = isNaN(parsedStartDate) ? new Date() : new Date(parsedStartDate);
        setSelectedDate(selectedDate)
        const availableDates = eventData.availableTicketsPerDays.map((ticket) => ticket.date);
        console.log("Fechas disponibles:", availableDates);

      } else {
        console.error("API response does not contain expected event data");
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  // FAVORITOS
  const buscarFavoritos = async () => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/liked-event-ids`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${usuarioActual.token}`,
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener favoritos");
        }
        return response.json();
      })
      .then((data) => {
        setFavoritos(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al buscar favorito:", error);
      });
  }

  const handleFavoriteClick = (id) => {
    // Verificamos si el usuario está autenticado
    if (!usuarioActual || !usuarioActual.token) {
      showPopup("Alerta", "Debe iniciar sesión para agregar a favoritos");
      return;
    }

    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/toggle-event-like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${usuarioActual.token}`,
        "Content-Type": "application/json",
      }, body:
        JSON.stringify({ eventId: id })

    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al agregar favorito");
        }
        buscarFavoritos();
      })
      .catch((error) => {
        console.error("Error al agregar/quitar favorito:", error);
      });
  };

  // CALENDARIO
  const handleDateClick = (date) => {
    const selectedDateISO = date.toISOString().split('T')[0]
    const availableTicketInfo = evento.availableTicketsPerDays.find((dateInfo) => dateInfo.date === selectedDateISO);

    if (
      selectedDateISO >= evento.startDate &&
      selectedDateISO <= evento.endDate
    ) {
      if (availableTicketInfo) {
        const disponibles = calcularTicketsDisponibles(availableTicketInfo);
        setTicketsDisponibles(disponibles);
        setSelectedDate(date);
        setSelectedDateISO(selectedDateISO)
        setCurrentTickets(0);
        setShowTicketsSoldOutAlert(false);
      } else {
        setShowTicketsSoldOutAlert(true);
        setTicketsDisponibles(null);
      }

    } else {
      console.log('Esta fecha no está dentro del rango del evento');
    }
  };


  const handleIncrement = () => {
    if (currentTickets < ticketsDisponibles) {
      setCurrentTickets(currentTickets + 1);
    }
  };

  const handleDecrement = () => {
    if (currentTickets > 1) {
      setCurrentTickets(currentTickets - 1);
    }
  };

  const showPopup = (title, content) => {
    setPopupTitle(title);
    setPopupContent(content);
    setPopupIsOpen(true);
  };

  return (
    <div className='master-container'>
      <div className="card-detail-container">


        <div className='eventType-Fav-section'>
          {/* Sección categoria del evento */}
          <div className="event-section">
            <p className="event-category"># {evento?.eventType?.name}</p>
          </div>
          {/* Sección agregar a favoritos */}
          <button
            className="event-secction-fav"
            onClick={() => handleFavoriteClick(evento.id)} >
            {isFavorito ? "❤️" : "🤍"}
          </button>

        </div>

        {/* Sección fotos */}
        <div className="images-container">
          <div className="img-add-container">
            {evento.additionalImages
              .slice(0, max_additional_images)
              .map((imageUrl, index) => (
                <img
                  key={index}
                  className={`img-add ${isModalOpen ? 'modal-open' : ''}`}
                  src={imageUrl}
                  alt={`${evento.name} - Image ${index + 2}`}
                />
              ))}
          </div>
          <div className="img-main-container">
            <img className={`img-main ${isModalOpen ? 'modal-open' : ''}`}
              src={evento.image1}
              alt={evento.name} />
            <div className='ver-mas-contain'>
              <button
                className="ver-mas-button"
                onClick={() => setIsModalOpen(true)}
              >
                VER MAS
              </button>
            </div>
          </div>
        </div>

        {/* Sección visualización fotos adicionales */}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Imágenes Adicionales"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <Carousel
            selectedItem={currentImageIndex}
            onChange={(index) => setCurrentImageIndex(index)}
            showArrows={true} // Muestra las flechas laterales
            showThumbs={false} // No muestra las miniaturas
            infiniteLoop={true}
            className="carousel-container"
          >
            <img src={evento.image1} alt={evento.name} />
            {evento.additionalImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${evento.name} - Image ${index + 2}`}
              />
            ))}
          </Carousel>
        </Modal>

        {/* Sección detalle evento */}
        <div className="detail-section">
          <h3 className="detail-title">{evento.name}</h3>
          <p className="detail-description">{evento.description}</p>
        </div>

        <div className='section-data-info'>
          {/* Sección fecha */}
          <div className="dates-section">
            <div className="date-item">
              <img className='icon' src={Calendar_Icon} alt="Calendar" />
              <div className="date-info">
                <p className="date-title">Fecha de inicio:</p>
                <p>{formatFecha(evento.startDate)}</p>
              </div>
            </div>

            <div className="date-item">
              <div className="date-info">
                <p className="date-title">Fecha de cierre:</p>
                <p>{formatFecha(evento.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Sección hora */}
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

          {/* Sección ubicación */}
          <div className="location-section">
            <img className="location-icon" src={Gps_icon} alt="Location" />
            <div className="location-info">
              <p className="location-title">Dirección:</p>
              <p className="location-value">{evento.street}</p>
            </div>
          </div>

          {/* Sección precios */}
          <div className="price-section">
            <img className="price-icon" src={Ticket_Icon} alt="Price" />
            <div className="price-info">
              <p className="price-title">Valor del evento: </p>
              <p className="price-value">${evento.pricePerTicket} </p>
            </div>
          </div>
        </div>

        {/* Sección características */}
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

        {/* Sección calendario */}
        <div className="calendar-section">
          <h3 className='dispo'>Disponibilidad</h3>
          {/* Sección boton aviso de liberacion de fechas disponibles */}
          <div className="button-container">
            <button className="button-avisar">
              Avisarme si se liberan fechas
            </button>
          </div>
          <div className='availability-section'>
            <Calendar
              className='booking-event'
              value={selectedDate}
              onClickDay={(date) => handleDateClick(date)}
              tileContent={(props) => (
                <CustomCalendarTile {...props} evento={evento} handleDateClick={handleDateClick} />
              )}
              tileDisabled={({ date }) => {
                const selectedDateISO = date.toISOString().split('T')[0];
                return (
                  selectedDateISO < evento.startDate ||
                  selectedDateISO > evento.endDate
                );
              }}

              tileClassName={({ date }) => {
                const selectedDateISO = date.toISOString().split('T')[0];
                if (isDateAvailable(date, evento)) {
                  return ''; // No se aplica ninguna clase CSS si hay boletos disponibles
                } else {
                  return 'day-no-tickets'; // Aplicar la clase CSS para días sin boletos disponibles
                }
              }}

            />
            <div className='infoDateTickets-evento'>
              {selectedDate && <p>Fecha seleccionada: {formatFecha(selectedDate)}</p>}
              {showTicketsSoldOutAlert && (
                <p className="tickets-alert">Tickets Agotados para esta fecha</p>
              )}
              {ticketsDisponibles !== null && (
                <p className="tickets-available">Maximo de tickets disponibles: {ticketsDisponibles}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección botones de reserva */}
        <div className="button-container-2">
          <div className="ticket-counter">
            <button
              className="ticket-counter-button"
              onClick={handleDecrement}
              disabled={currentTickets <= 1}
            >
              &lt;
            </button>
            <span className="ticket-count">{currentTickets}</span>
            <button
              className="ticket-counter-button"
              onClick={handleIncrement}
              disabled={currentTickets >= ticketsDisponibles}
            >
              &gt;
            </button>
          </div>
          <button
            className="button-reserva"
            onClick={() => {
              // Verificamos si el usuario está autenticado
              if (!usuarioActual || !usuarioActual.token) {
                showPopup("Alerta", "Debe iniciar sesión para reservar");
              } else {
                // Redirige solo si el usuario está autenticado
                window.location.href = `/EventReservationDetail/${evento.id}?date=${selectedDateISO}&tickets=${currentTickets}`;
              }
            }}
          >
            Ir a la reserva
          </button>
          <CustomPopup
            isOpen={popupIsOpen}
            onClose={() => setPopupIsOpen(false)}
            title={popupTitle}
            content={popupContent}
            customClass="mi-clase-personalizada" 
            redirectTo='/iniciarSesion'
          />

        </div>

        {/* Sección politicas */}
        <div className='politics-section'>
          <h3 className='politics-title'> Políticas y condiciones del evento</h3>

          <div className='p-section'>
            <h4 className='detail-title-policy'>{evento.policy1Name}</h4>
            <p className='detail-description-policy'>{evento.policy1Description}</p>
            <h4 className='detail-title-policy'>{evento.policy2Name}</h4>
            <p className='detail-description-policy'>{evento.policy2Description}</p>
            <h4 className='detail-title-policy'>{evento.policy3Name}</h4>
            <p className='detail-description-policy'>{evento.policy3Description}</p>
          </div>
        </div>
      </div>
    </div>
  );

};
export default EventDetail;
