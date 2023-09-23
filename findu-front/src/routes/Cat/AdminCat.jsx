import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import deleteimg from '../../images/delete.png'
import '../../styles/AdminCat.css'
import '../../styles/Modal.css'

const AdminCat = () => {

  const [categorias, setCategorias] = useState({ content: [], first: false, last: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [catIdToDelete, setcatIdToDelete] = useState(null);

  useEffect(() => {
    // Realiza la solicitud fetch para obtener la lista de eventos
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/event-types?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setCategorias(data); // Asigna los datos al estado
      })
      .catch(error => {
        console.error('Error al obtener la lista de categorias:', error);
      });
  }, [currentPage]);

  const eliminar = (id) => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/event-types/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            'Error al eliminar la categoria. Por favor, intenta nuevamente.'
          );
        }
        console.log('categoria eliminado exitosamente.');
        setCategorias(prevCategorias => ({
          ...prevCategorias,
          content: prevCategorias.content.filter(categoria => categoria.id !== id)
        }));

      })
      .catch(error => {
        console.error('Error:', error);
      })
  };


  const openModal = (id) => {
    setShowModal(true);
    setcatIdToDelete(id);
    console.log('showModal:', showModal);
  };

  const closeModal = () => {
    setShowModal(false);
    setcatIdToDelete(null);
  };

  const confirmDelete = () => {
    eliminar(catIdToDelete);
    closeModal();
  };


  return (
    <div className="admin-cat-section">

      <div className='cat-add-conteiner'>
        <h3 className="manage-cat" >Administrar Categorias</h3>
        <Link to='/addCat'>
          <button className='add-event-button'>Agregar Categoria</button>
        </Link>
      </div>

      <div className="admin-cat-sectionn">
        {console.log(categorias)}
        {Array.isArray(categorias.content) && categorias.content.length > 0 ? (
          categorias.content.map(categoria => (
            <div key={categoria.id} className="cat-box">
              <div className="cat-content">
                <p className="cat-label">{categoria.name}</p>
                <div className="images">
                  <img onClick={() => openModal(categoria.id)} src={deleteimg} alt="Imagen 2" className="image-delete" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay categorias disponibles.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de que deseas eliminar esta categoría? 
              Si confirmas, todos sus eventos asociados serán eliminados</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={confirmDelete}>Eliminar</button>
              <button className="modal-button" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <div className="pagination">
        <button
          disabled={categorias.first}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="arrow"
        >
          &#9668;
        </button>
        <span>Página {currentPage}</span>
        <button
          // disabled={recomendaciones.length === 0} // Otra forma de verificar si hay más páginas
          disabled={categorias.last}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="arrow"
        >
          &#9658;
        </button>
      </div>

    </div>


  )
}

export default AdminCat