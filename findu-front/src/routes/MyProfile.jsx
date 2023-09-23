import "../styles/MyProfile.css";
import Header from "../utils/Header";

const MyProfile = ({
  showAvatar = true,
  showName = true,
  showEmail = true,
  showLogoutButton = true,
  showEditButton = true,
}) => {
  const userData = JSON.parse(localStorage.getItem("dataUser"));
  const isLoggedIn = userData !== null; // Cambia esto según cómo verificas si el usuario está logueado

  // función para generar las iniciales:
  function getInitials(name) {
    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0));
    return initials.join("").toUpperCase();
  }

  function redirectHome() {
    window.location.href = "/";
  }

  const handleLogout = () => {
    // Eliminar la información del usuario del localStorage
    localStorage.removeItem("dataUser");

    // Redireccionar al usuario a la página principal
    window.location.href = "/";
  };

  return (
    <div className="my-profile">
      {/* Si el usuario no está logueado, redireccionar a la página principal */}
      {!isLoggedIn &&
        window.location.href === "/miPerfil" &&
        (window.location.href = "/")}

      {showAvatar && (
        <div className="avatar-container">
          <div className="avatar2" onClick={redirectHome}>
            {getInitials(userData.firstName + " " + userData.lastName)}
          </div>
        </div>
      )}

      {showName && (
        <h3 className="name" onClick={redirectHome}>
          {" "}
          {userData.firstName + " " + userData.lastName}
        </h3>
      )}
      {showEmail && (
        <h3 className="email" onClick={redirectHome}>
          {userData.email}
        </h3>
      )}
      {showLogoutButton && (
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      )}
      {showEditButton && <button className="edit-button">Editar perfil</button>}
      <Header showButtonA={false} showButtonB={false} />
    </div>
  );
};

export default MyProfile;
