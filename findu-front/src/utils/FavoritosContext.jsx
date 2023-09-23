import  { createContext, useContext, useState } from 'react';

// Creamos el contexto
const FavoritosContext = createContext();

// Creamos el hook personalizado para acceder al contexto
export const useFavs = () => {
  return useContext(FavoritosContext);
};

// Creamos el proveedor de contexto
export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const handleToggleFavorito = (eventId) => {
    if (favoritos.includes(eventId)) {
      setFavoritos(favoritos.filter(id => id !== eventId));
    } else {
      setFavoritos([...favoritos, eventId]);
    }
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, handleToggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};


