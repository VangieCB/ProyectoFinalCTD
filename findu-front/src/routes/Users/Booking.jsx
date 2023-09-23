import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import '../../styles/Booking.css'
import '../../styles/Modal.css'

function formatFecha(fecha) {
  const dateObj = new Date(fecha);
   // Establece la hora en formato UTC (ejemplo: 00:00:00 UTC)
   dateObj.setUTCHours(0, 0, 0, 0);
   const day = String(dateObj.getUTCDate()).padStart(2, '0');
   const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
   const year = dateObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatearFecha(fechaUTC) {
  try {
    // Convierte la fecha UTC en un objeto Date
    const fecha = new Date(fechaUTC);

    // Define opciones para el formato de fecha basado en la configuración regional
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };

    // Formatea la fecha en el formato "dd/mm/yyyy" basado en la configuración regional
    const fechaFormateada = fecha.toLocaleDateString(undefined, opciones);

    return fechaFormateada;
  } catch (error) {
    return "Fecha en formato incorrecto";
  }
}

function formatHora(hora) {
  const dateObj = new Date(hora);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

const Booking = () => {
  const [reservas, setReservas] = useState({content:[], first: false, last: false});
  const [currentPage, setCurrentPage] = useState(1);
  const [maxItems, setMaxItems] = useState(getMaxItems());
  const usuarioActual = JSON.parse(localStorage.getItem("dataUser"));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/bookings/by-user?page=${currentPage}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${usuarioActual.token}`,
      "Content-Type": "application/json",
    },})
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        setReservas(data);
        console.log(data)
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, [currentPage]);

  function getMaxItems() {
    return window.innerWidth <= 360 ? 8 : 9;
  }

  useEffect(() => {
    const handleResize = () => {
      setMaxItems(getMaxItems());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
    
    
  return (
    <>
      <h2 className="titulo-booking">Mis reservas</h2>
      <div className="card-booking-container">
        {reservas.content.map((reserva) => (
          <div key={reserva.id} className="card-booking">
            <div className='card-booking-content'>
              <h3 className='tit-booking'>{reserva.event.name}</h3>
              <ul>
                <li className='li-booking'><p className='label-booking'>Nro. de Reserva: <span className="valor-reco">{reserva.id}</span></p></li>
                <li className='li-booking'><p className='label-booking'>Fecha de Asistencia: <span className="valor-reco"> {formatFecha(reserva.attendanceDate)}</span></p></li>
                <li className='li-booking'><p className='label-booking'>Hora del Evento: De las <span className='valor-reco'> {formatHora(reserva.event.startDate + "T" + reserva.event.openingTime)}hs a las {formatHora(reserva.event.startDate + "T" + reserva.event.closingTime)}hs</span></p></li>
                <li className='li-booking'><p className='label-booking'>Dirección del Evento: <span className='valor-reco'> {reserva.event.street}</span></p></li>
                <li className='li-booking'><p className='label-booking'>Nro. de Tickets: <span className='valor-reco'> {reserva.tickets}</span></p></li>
                <li className='li-booking'><p className='label-booking'>Precio a Pagar: <span className='valor-reco'>${reserva.paymentAmount}</span></p></li>
                <li className='li-booking'><p className='label-booking'>Fecha de Emisión: <span className='valor-reco'>{formatearFecha(reserva.issueDate)}</span></p></li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={reservas.first}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="arrow"
        >
          &#9668;
        </button>
        <span>Página {currentPage}</span>
        <button
          disabled={reservas.last}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="arrow"
        >
          &#9658;
        </button>
      </div>
    </>
  );
};

export default Booking;