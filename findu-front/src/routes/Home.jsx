import React from "react";
import CardCat from "../utils/CardCat";
import SearchBar from "../utils/SearchBar";
import CardReco from "../utils/CardReco";
import CardSearch from "../utils/CardSearch";
import Header from "../utils/Header";
import { useState } from "react";
import { format } from "date-fns"; // Importa la función format de date-fns

const Home = () => {
//   const handleSearch = (searchTerm) => {
    
//     setMostrarResultados(!MostrarResultados);
//     console.log("Búsqueda realizada:", searchTerm);
//     console.log(MostrarResultados);
//   };

  
  const [formatnombre, setFormatnombre] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");

  const recibirVariables = (nombre, fechaFin, fechaInicio) => {
    setFormatnombre(nombre),
      setFormattedEndDate(fechaFin),
      setFormattedStartDate(fechaInicio);
      console.log(nombre);
  };

  return (
    <>
      <div>
        <div className="content">
          <SearchBar enviarVariables={recibirVariables} />
        </div>
        <h2 className="categorias">Categorías</h2>
        <CardCat />
        <h2 className="recomendaciones">
          {
            formatnombre.trim().length > 0 ||
            (formattedStartDate != "" && formattedEndDate != "") ?
            'Resultados de tu búsqueda' :
            'Recomendaciones'
          }
        </h2>
        {formatnombre.trim().length > 0 ||
        (formattedStartDate != "" && formattedEndDate != "") ? (
          <CardSearch
            formattedStartDate ={formattedStartDate ? format(formattedStartDate, "yyyy-MM-dd") : ""}
            formattedEndDate={formattedEndDate ? format(formattedEndDate, "yyyy-MM-dd") : ""}
            formatnombre={formatnombre}
          />
        ) : (
          <CardReco showRecommendations={true} />
        )}
        {/* <CardReco showRecommendations={MostrarResultados}/> */}
        <Header showButtonA={true} showButtonB={true} />
      </div>
    </>
  );
};

export default Home;
