import "../styles/DropMenu.css";
import { Link } from "react-router-dom";

const DropMenu = ({ isOpen, onClose }) => {
  const handleLogout = () => {
    // Eliminar la información del usuario del localStorage
    localStorage.removeItem("dataUser");

    // Redireccionar al usuario a la página principal
    window.location.href = "/";
  };

  return isOpen ? (
    <div className="dropdown-menu">
      <ul>
        <Link className="link-menu" to={`/miPerfil`}>
          <li>Perfil</li>
        </Link><hr />
        <Link className="link-menu" to={`/Favs`}>
          <li>Favoritos</li>
        </Link><hr/>
        <Link className="link-menu" to={`/Booking`}>
          <li>Reservas</li>
        </Link><hr/>
        <li  className="link-menu" onClick={handleLogout}>Cerrar sesión</li>
      </ul>
     
    </div>
  ) : null;
};

export default DropMenu;
