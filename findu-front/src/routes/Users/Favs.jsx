import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import '../../styles/Favs.css'


function formatFecha(fecha) {
  const dateObj = new Date(fecha);
   // Establece la hora en formato UTC (ejemplo: 00:00:00 UTC)
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


const Favs = () => {
  const [recomendaciones, setRecomendaciones] = useState({content:[], first: false, last: false});
  const [currentPage, setCurrentPage] = useState(1);
  const [maxItems, setMaxItems] = useState(getMaxItems());
  const usuarioActual = JSON.parse(localStorage.getItem("dataUser"));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/liked-events?page=${currentPage}`, {
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
        setRecomendaciones(data);
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
      <h2 className="titulo-fav">Mis favoritos</h2>
      <div className="card-reco-container">
        {recomendaciones.content.slice(0, maxItems).map((recomendacion) => (
          <div key={recomendacion.id} className="card-reco">
            <img className="img-reco" src={recomendacion.image1} alt={recomendacion.name} />

            <div className='card-reco-content'>
              <h3 className='titulo-reco'>{recomendacion.name}</h3>
              <p className='label-reco'>Fecha: <span className="valor-reco"> {formatFecha(recomendacion.startDate)} al {formatFecha(recomendacion.endDate)}</span></p>
              <p className='label-reco'>Hora: <span className="valor-reco"> {formatHora(recomendacion.startDate + "T" + recomendacion.openingTime)} hasta las {formatHora(recomendacion.startDate + "T" + recomendacion.closingTime)}</span></p>
              <Link to={`/event/${recomendacion.id}`}>
                <button className='button-info'>VER</button>
              </Link> 
            </div>
          </div>

        ))}
      </div>


      <div className="pagination">
  <button
    disabled={recomendaciones.first}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="arrow"
  >
    &#9668;
  </button>
  <span>Página {currentPage}</span>
  <button
    // disabled={recomendaciones.length === 0} // Otra forma de verificar si hay más páginas
    disabled={recomendaciones.last}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="arrow"
  >
    &#9658;
  </button>
</div>

    </>
  );
};

export default Favs;