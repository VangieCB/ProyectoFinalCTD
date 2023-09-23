import { useFavoritos } from "./FavoritosContext";
import { useEffect, useState } from "react";
import "./Fav.css";
import { UseFavs } from "./FavoritosContext";

const Fav = () => {
  const { favoritos, handleToggleFavorito } = useFavoritos();

  const [currentPage, setCurrentPage] = useState(1);
  const usuarioActual = JSON.parse(localStorage.getItem("dataUser"));
  const [recomendaciones, setRecomendaciones] = useState({
    content: [],
    first: false,
    last: false,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/liked-events?page=${currentPage}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${usuarioActual.token}`,
        "Content-Type": "application/json",
      },
    })
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

  return (
    <div>
      <button
        className={`fav-button ${
          favoritos.includes(recomendaciones.id) ? "favorito" : ""
        }`}
        onClick={() => handleToggleFavorito(recomendaciones.id)}
      >
        {favoritos.includes(recomendaciones.id) ? "❤️" : "🤍"}
      </button>

      <div>
      <UseFavs datos={recomendaciones} />
    </div>
    </div>


    
  
  );
};

export default Fav;
