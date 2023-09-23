import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/CardCat.css'


const CardCat = () => {

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Realiza la solicitud fetch para obtener la lista de eventos
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/event-types/all`)
      .then(response => response.json())
      .then(data => {
        setCategorias(data); // Asigna los datos al estado
      })
      .catch(error => {
        console.error('Error al obtener la lista de categorías:', error);
      });
  }, []);

  const handleFavoriteClick = (id) => {
    // Lógica para agregar o quitar de favoritos según el id de la categoría
    console.log(`Categoría ${id} agregado`);
  };

  const handleViewMoreClick = (id) => {
    // Lógica para mostrar más información sobre la categoría según el id
    console.log(`Categoría ${id} ver más`);
  };

  return (
    <div className="card-cat-container">
  {Array.isArray(categorias) &&
    categorias.slice(0, 5).map((categoria, index) => (
      <div key={categoria.id} className="card-cat">
        <img className="img-cat" src={categoria.image1} alt={categoria.name} />
        <p>{categoria.name}</p>
        <Link to={`/eventsByCat/${categoria.id}`}>
          <button className="button-link" onClick={() => handleViewMoreClick(categoria.id)}>
            VER EVENTOS
          </button>
        </Link>
      </div>
    ))}
  {Array.isArray(categorias) && categorias.length > 5 && (
    <button className="ver-mas-button" onClick={() => handleViewMoreClick(null)}>
      Ver Más
    </button>
  )}
</div>

  );
};

export default CardCat