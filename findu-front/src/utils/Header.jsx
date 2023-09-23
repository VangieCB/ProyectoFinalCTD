import { Link } from 'react-router-dom';
import '../styles/Header.css';
import React, { useState } from 'react';
import DropMenu from './DropMenu';


const Header = ({ showButtonA, showButtonB }) => {
  // Verificar si el usuario está logueado
  const userData = JSON.parse(localStorage.getItem("dataUser"));
  const isLoggedIn = userData !== null; // Cambia esto según cómo verificas si el usuario está logueado


  // función para generar las iniciales:
  function getInitials(name) {
    const names = name.split(' ');
    const initials = names.map(name => name.charAt(0));
    return initials.join('').toUpperCase();
  }


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar la visibilidad del menú
  };



  return (
    <nav className='navbar'>
      <div className="navbar-left">
        <Link to='/'>
          <img src="/FindU.svg" alt="logo" />
        </Link>
        <h4>Explora, conecta, experimenta</h4>
      </div>


      {isLoggedIn ? (
        <div className='navbar-right logeado'>

          {userData.role == "ADMIN" ? (
            <Link to='/adminPanel' className='button-panel'>
              <button className='button-panel'>Panel Adm</button>
            </Link>
          ) : null}

          <div className="avatar" onClick={handleAvatarClick}>
            {/* Agregar aquí el contenido del avatar */}
            {getInitials(userData.firstName + " " + userData.lastName)}
          </div>
          <DropMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        </div>

      ) : (
        <div className='navbar-right'>
          <Link to='/iniciarSesion' className='button-nav.navbar-right'>
            {showButtonA && <button className='button-nav'>Iniciar Sesión</button>}
          </Link>
          <Link to='/registrarse' className='button-nav.navbar-right'>
            {showButtonB && <button className='button-nav'>Registrarse</button>}
          </Link>
        </div>
      )}


    </nav >
  );
}

export default Header;