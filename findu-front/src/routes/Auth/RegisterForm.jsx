import { useState, useEffect } from "react";
import '../../styles/RegisterForm.css'
import Header from '../../utils/Header'

function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showSpinner, setShowSpinner] = useState(false); // Nuevo estado para mostrar el modal de spinner
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  

  function SpinnerModal() {
    return (
      <div className="modal-background">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Función para mostrar el modal de confirmación
  const showConfirmation = () => {
    setShowConfirmationModal(true);

    // Cierra el modal de confirmación después de 5 segundos
    setTimeout(() => {
      setShowConfirmationModal(false);
    }, 3000);
  };

  useEffect(() => {
    if (!email.includes("@")) {
      setEmailError("Ingresa un correo electrónico válido");
    } else {
      setEmailError("");
    }

    if (password.length < 6 || !/\d/.test(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 6 caracteres y un número"
      );
    } else {
      setPasswordError("");
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmPasswordError("");
    }
  }, [email, password, confirmPassword]);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (emailError || passwordError || confirmPasswordError) {
      alert(
        "Alguno de los datos ingresados no son correctos: Por favor ingresa un correo electrónico válido y comprueba que la contraseña tenga al menos 6 caracteres y un número, verifica que la contraseña coincida en ambos campos."
      );
      return;
    }

    // Muestra el modal de spinner
    setShowSpinner(true);

    try {
      await fetchUser(firstName, lastName, email, password);

      // Registro exitoso
      // Borra la información de los campos del formulario
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Muestra el modal de confirmación después de cargar el spinner
      setTimeout(() => {
        setShowSpinner(false);
        showConfirmation();
      }, 2000); 
    } catch (error) {
      console.error(error);

      // Manejar errores de registro
    } finally {
      // Cierra el modal de spinner después de un tiempo (por ejemplo, 2 segundos)
      setTimeout(() => {
        setShowSpinner(false);
      }, 3000);
    }
  };

  const fetchUser = async (firstName, lastName, email, password) => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/register`; // Reemplaza esto con la URL correcta
      const response = await fetch(url, {
        method: 'POST', // Usamos el método POST para enviar datos al servidor
        headers: {
          'Content-Type': 'application/json', // Indicamos que estamos enviando JSON en el cuerpo
        },
        body: JSON.stringify({ firstName, lastName, email, password }), // Convertimos los datos en formato JSON
      });
      
      const data = await response.json(); console.log(data);
      // localStorage.setItem('dataUser', JSON.stringify(data)); // Guardamos el token en localStorage para usarlo después

    } catch (error) {
      console.log(error);
    }
  };

  // Si el usuario no está registrado, mostramos el formulario de registro
  return (
    <div className="formulario-container">
    <form onSubmit={handleSubmit}>
      (
      <div className="registro">
        <label>
          <h2 className="titulo2">Registro</h2>
          <h3 className="titulo">Nombre</h3>
          <input
            type="text"
            className="input-registro"
            placeholder="Elige un nombre..."
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </label>
        <br />

        <label>
          <h3 className="titulo">Apellido</h3>
          <input
            type="text"
            className="input-registro"
            placeholder="Elije un apellido..."
            value={lastName}
            onChange={handleLastNameChange}
          />
        </label>
        <br />

        <label>
          <h3 className="titulo">Correo electrónico</h3>
          <input
            type="text"
            className="input-registro"
            placeholder="Añade un correo electrónico..."
            value={email}
            onChange={handleEmailChange}
          />
        </label>
        {emailError && <span className="error-message">{emailError}</span>}
        <br />

        <label>
          <h3 className="titulo">Contraseña</h3>
          <input
            type="password"
            className="input-registro"
            placeholder="Añade una contraseña..."
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        {passwordError && (
          <span className="error-message">{passwordError}</span>
        )}
        <br />

        <label>
          <h3 className="titulo">Confirmar Contraseña</h3>
          <input
            type="password"
            className="input-registro"
            placeholder="Confirma la contraseña..."
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </label>
        {confirmPasswordError && (
          <span className="error-message">{confirmPasswordError}</span>
        )}
        <br />

        <button type="submit" className="botonRegistro">
          Registrarse
        </button>

        <button type="submit" className="iniciarSesionBoton">
          Iniciar sesión
        </button>

        <Header showButtonA={false} showButtonB={false} />

        {/* Mostrar el modal de spinner si showSpinner es true */}
        {showSpinner && <SpinnerModal />}
        {showConfirmationModal && (
        <div className="confirmation-modal">
          <p>Se ha enviado un correo con la confirmación de registro</p>
        </div>
        )}
      </div>
      )
    </form>
    </div>
  );
}

export default RegisterForm;
