import React, { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/SearchBar.css";
import es from "date-fns/locale/es";

// import CardSearch from "../utils/CardSearch";
// import CardReco from "./CardReco";

function SearchBar({ enviarVariables }) {
  const [nombre, setNombre] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [resultados, setResultados] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const autosuggestRef = useRef(null);
  // const [formatnombre, setFormatnombre] = useState("");
  // const [formattedStartDate, setFormattedStartDate] = useState("");
  // const [formattedEndDate, setFormattedEndDate] = useState("");

  const enviarVariablesAlPadre = () => {
    enviarVariables(nombre, endDate, startDate);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/autocomplete/home`)
      .then((response) => response.json())
      .then((data) => {
        setSugerencias(data);
      })
      .catch((error) => {
        console.error("Error fetching autocompletado:", error);
      });
  }, []);

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : sugerencias.filter(
          (sugerencia) =>
            sugerencia.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const renderSuggestion = (suggestion) => (
    <div className="suggestion-item">{suggestion}</div>
  );

  const getSuggestionValue = (suggestion) => suggestion;

  const onChange = (event, { newValue }) => {
    setNombre(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // const filtrarResultados = () => {
  //   // Formatea las fechas en el formato "yyyy-mm-dd"
  //   setFormattedStartDate(startDate ? format(startDate, "yyyy-MM-dd") : "");
  //   setFormattedEndDate(endDate ? format(endDate, "yyyy-MM-dd") : "");
  //   setFormatnombre(nombre);
  //   // console.log(`Filtrar por Nombre: ${formatnombre}, Fecha de Inicio: ${formattedStartDate}, Fecha de Fin: ${formattedEndDate}`);
  //   // ... Resto de tu lógica de filtrado ...
  // };

  const limpiarFiltro = () => {
    setNombre("");
    setStartDate("");
    setEndDate("");
    // setFormattedStartDate("");
    // setFormattedEndDate("");
    // setFormatnombre("");
    // enviarVariablesAlPadre();
  };

  const handleClearNombre = () => {
    setNombre("");
  };

  // const handleImput = (event, { newValue, method }) => {
  //   setFormatnombre(newValue);
  // };

  const inputProps = {
    type: "text",
    className: "search-bar-input",
    placeholder: "Buscar...",
    value: nombre,
    onChange,
  };

  return (
    <div>
      <div className="search-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // filtrarResultados();
            enviarVariablesAlPadre();
          }}
        >
          <label className="" htmlFor="nombre">
            <div className="">
              <Autosuggest
                ref={autosuggestRef}
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                
              />
              {nombre && (
                <button className="search-bar-x" onClick={handleClearNombre}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </label>
          <br />

          <div className="date-picker" id="date-picker-1">
            <DatePicker
              className="search-bar-date-start"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              locale={es}
              dateFormat="dd-MM-yyyy" // Establece el formato de fecha
              calendarClassName="custom-calendar-start"
              wrapperClassName="calendar-wrapper"
              placeholderText="Desde"
            />
            <label className="calendar-label" id="calendar-icon-1">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="calendar-icon-start"
              />
            </label>
          </div>

          <div className="date-picker" id="date-picker-2">
            <DatePicker
              className="search-bar-date-end"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              locale={es}
              dateFormat="dd-MM-yyyy" // Establece el formato de fecha
              calendarClassName="custom-calendar-end"
              wrapperClassName="calendar-wrapper"
              placeholderText="Hasta"
            />
            <label className="calendar-label" id="calendar-icon-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="calendar-icon-end"
              />
            </label>
          </div>

          <button
            className="search-bar-trash-button"
            type="submit"
            onClick={limpiarFiltro}
          >
            <span className="search-icon-trash">
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <span className="search-text-trash" id="search-text-trash">LIMPIAR BÚSQUEDA</span>
          </button>

          <button className="search-bar-button" type="submit">
            <span className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <span className="search-text">BUSCAR</span>
          </button>
          <br />
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
