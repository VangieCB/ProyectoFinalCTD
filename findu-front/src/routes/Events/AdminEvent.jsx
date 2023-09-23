
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import '../../styles/AdminEvent.css'
import '../../styles/Modal.css'
import image2 from '../../images/delete.png';
import imageEye from '../../images/eye.png';


const AdminPanel = () => {

  const [eventos, setEventos] = useState({
    content: [],
    first: false,
    last: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  useEffect(() => {
    // Realiza la solicitud fetch para obtener la lista de eventos
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setEventos(data); // Asigna los datos al estado
      })
      .catch(error => {
        console.error('Error al obtener la lista de eventos:', error);
      });
  }, [currentPage]);

  const eliminar = (id) => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            'Error al eliminar el evento. Por favor, intenta nuevamente.'
          );
        }
        console.log('Evento eliminado exitosamente.');
        setEventos(eventos.filter(evento => evento.id !== id));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const openModal = (id) => {
    setShowModal(true);
    setEventIdToDelete(id);
  };

  const closeModal = () => {
    setShowModal(false);
    setEventIdToDelete(null);
  };

  const confirmDelete = () => {
    eliminar(eventIdToDelete);
    closeModal();
  };


  return (
    <div className="admin-event-section">

      <div className='admin-add-conteiner'>
        <h3 className="manage-events" >Administrar Eventos</h3>
        <Link to='/addEvent'>
          <button className='add-event-button'>Agregar Evento</button>
        </Link>
      </div>

      <div className="admin-event-sectionn">
        {eventos.content.map(evento => (
          <div key={evento.id} className="product-box">
            <div className="product-content">
              <p className="event-id">#{evento.id}</p>
              <Link to={`/editEvent/${evento.id}`} className="event-link" title='Editar evento'>
                <p className="event-label">{evento.name}</p>
              </Link>
              <Link to={`/event/${evento.id}`}>
                <img className='event-image' title='Ver evento' src={imageEye} alt="ver evento" />
              </Link>
              <div className="images">
                <img onClick={() => openModal(evento.id)} src={image2} alt="Eliminar" className="image-delete image-delete-margin" title='Eliminar evento' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de que deseas eliminar este evento?</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={confirmDelete}>Eliminar</button>
              <button className="modal-button" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}


      <div className="pagination">
        <button
          disabled={eventos.first}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="arrow"
        >
          &#9668;
        </button>
        <span>Página {currentPage}</span>
        <button
          // disabled={recomendaciones.length === 0} // Otra forma de verificar si hay más páginas
          disabled={eventos.last}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="arrow"
        >
          &#9658;
        </button>
      </div>
    </div>


  )
}

export default AdminPanel