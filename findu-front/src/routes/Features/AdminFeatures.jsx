import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminFeatures.css'
import '../../styles/Modal.css'
import image2 from '../../images/delete.png';
import imageEdit from '../../images/edit.png';

const AdminFeatures = () => {
    const [features, setFeatures] = useState({
        content: [],
        first: false,
        last: false,
    });
    const [showModal, setShowModal] = useState(false);
    const [featureIdToDelete, setFeatureIdToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Realiza la solicitud fetch para obtener la lista de características
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/features?page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setFeatures(data); // Asigna los datos al estado
            })
            .catch(error => {
                console.error('Error al obtener la lista de características:', error);
            });
    }, [currentPage]);

    const eliminar = (id) => {
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/features/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        'Error al eliminar la característica. Por favor, intenta nuevamente.'
                    );
                }
                console.log('feature eliminado exitosamente.');
                setFeatures(prevFeatures => ({
                    ...prevFeatures,
                    content: prevFeatures.content.filter(feature => feature.id !== id)
                }));

            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const openModal = (id) => {
        setShowModal(true);
        setFeatureIdToDelete(id);
    };

    const closeModal = () => {
        setShowModal(false);
        setFeatureIdToDelete(null);
    };

    const confirmDelete = () => {
        eliminar(featureIdToDelete);
        closeModal();
    };

    return (
        <div className="admin-feature-section">

            <div className="feature-add-container">
                <h3 className="manage-feature">Administrar Características</h3>
                <Link to="/addFeature">
                    <button className="add-feature-button">Agregar Característica</button>
                </Link>
            </div>

            <div className="admin-feature-sectionn">
                {Array.isArray(features.content) && features.content.length > 0 ? (
                    features.content.map(feature => (
                        <div key={feature.id} className="feature-box">
                            <div className="left-content">
                                <p className="feature-id">#{feature.id}</p>
                                <div className='feature-icon'><img src={`https://gr6.s3.amazonaws.com/i/${feature.iconCode}.svg`} alt="Icono" /></div>
                                <p className="feature-label">{feature.name}</p>

                            </div>
                            <div className="right-content">
                                <Link to={`/editFeature/${feature.id}`}>
                                    <img className='featureEdit-image' title='Editar' src={imageEdit} alt="Editar" />
                                </Link>
                                <div className="images">
                                    <img onClick={() => openModal(feature.id)} src={image2} alt="Eliminar" className="image-delete image-delete-margin" title='Eliminar' />
                                </div>
                            </div>
                        </div>

                    ))
                ) : (
                    <p>No hay características disponibles.</p>
                )}
            </div>


            {
                showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>¿Estás seguro de que deseas eliminar esta característica?</p>
                            <div className="modal-buttons">
                                <button className="modal-button" onClick={confirmDelete}>Eliminar</button>
                                <button className="modal-button" onClick={closeModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="pagination">
                <button
                    disabled={features.first}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="arrow"
                >
                    &#9668;
                </button>
                <span>Página {currentPage}</span>
                <button
                    // disabled={recomendaciones.length === 0} // Otra forma de verificar si hay más páginas
                    disabled={features.last}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="arrow"
                >
                    &#9658;
                </button>
            </div>
        </div >
    );
};

export default AdminFeatures;
