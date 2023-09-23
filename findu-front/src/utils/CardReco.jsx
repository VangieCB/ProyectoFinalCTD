import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/CardReco.css";


import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";

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
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

const CardReco = ({ showRecommendations }) => {
  const [recomendaciones, setRecomendaciones] = useState({
    content: [],
    first: false,
    last: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [maxItems, setMaxItems] = useState(getMaxItems());


  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/events/randoms?page=${currentPage}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        setRecomendaciones(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, [currentPage]);

  function getMaxItems() {
    return window.innerWidth <= 360 ? 8 : 9;
  }

  useEffect(() => {
    const handleResize = () => {
      setMaxItems(getMaxItems());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    image1: '',
    name: '',
    description: '',
    link: ''
  });
  const [quoteText, setQuoteText] = useState('');
  // const shareUrl = "https://findu-front.herokuapp.com/";
  // const quoteText = textValue;

  const openModal = (recomendacion) => {
    setShowModal(true);
    setModalInfo({
      image1: recomendacion.image1,
      name: recomendacion.name,
      description: recomendacion.description,
      link: `${window.location.origin}/event/${recomendacion.id}`
    });
    setQuoteText('');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalInfo({
      image1: '',
      name: '',
      description: '',
      link: ''
    });
    setQuoteText('');
  };

  return (
    <>
      {showRecommendations && (
        <div className="card-reco-container">
          {recomendaciones.content.slice(0, maxItems).map((recomendacion) => (
            <div key={recomendacion.id} className="card-reco">
              <img
                className="img-reco"
                src={recomendacion.image1}
                alt={recomendacion.name}
              />

              <div className="card-reco-content">
                <div className="titulo-compartir">
                  <h3 className="titulo-reco">{recomendacion.name}</h3>
                  <img
                    src="/src/images/Vector.svg"
                    className="button-share"
                    onClick={() => openModal(recomendacion)}
                    alt="compartir"
                  />

                </div>

                <p className="label-reco">
                  Fecha:{" "}
                  <span className="valor-reco">
                    {" "}
                    {formatFecha(recomendacion.startDate)} al{" "}
                    {formatFecha(recomendacion.endDate)}
                  </span>
                </p>
                <p className="label-reco">
                  Hora:{" "}
                  <span className="valor-reco">
                    {" "}
                    {formatHora(
                      recomendacion.startDate + "T" + recomendacion.openingTime
                    )}{" "}
                    hasta las{" "}
                    {formatHora(
                      recomendacion.startDate + "T" + recomendacion.closingTime
                    )}
                  </span>
                </p>
                <Link to={`/event/${recomendacion.id}`}>
                  <button className="button-info">VER</button>
                </Link>
              </div>
            </div>
          ))}

          {showModal && (
            <div className="modal-redes">
              <div className="conteiner-redes">
                <div className="imagen-info">
                  <img
                    className="img-redes"
                    src={modalInfo.image1}
                    alt={modalInfo.name}
                  />
                  <div className="info">
                    <h2>{modalInfo.name}</h2>
                    <p>{modalInfo.description}</p>

                    {/* Preguntar a adrian  */}
                    <p>Enlace: {modalInfo.link}</p>
                  </div>
                </div>
                <textarea
                  className="text-area"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                // Otras propiedades del textarea, como rows, cols, etc.
                />

                <div className="social-share">
                  <FacebookShareButton url={modalInfo.link} quote={quoteText} hashtag={'#FindU'}>
                    <img src="/face_blanco.svg" alt="Compartir en Facebook" />
                  </FacebookShareButton>

                  <TwitterShareButton url={modalInfo.link} title={quoteText}>
                    <img src="/x_blanco.svg" alt="Compartir en Twitter" />
                  </TwitterShareButton>

                  <LinkedinShareButton url={modalInfo.link} title={modalInfo.name} summary={quoteText} source={'FindU'}>
                    <img src="/linkedin_blanco.svg" alt="Compartir en LinkedIn" />
                  </LinkedinShareButton>

                  <WhatsappShareButton url={modalInfo.link} title={quoteText} separator={'\n'}>
                    <img src="/wp_blanco.svg" alt="Compartir en WhatsApp" />
                  </WhatsappShareButton>
                </div>

                <button className="modal-buttonn" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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

export default CardReco;
