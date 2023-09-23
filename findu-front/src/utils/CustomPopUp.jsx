import React from 'react';

function CustomPopup({ isOpen, onClose, title, content, customClass, redirectTo }) {
  if (!isOpen) {
    return null;
  }

  const handleCloseClick = () => {
    onClose();
    if (redirectTo) {
      window.location.href = redirectTo; // Utiliza el valor de redirectTo si está definido
    }
  };

  return (
    <div className={`custom-modal ${customClass}`}>
      <h3>{title}</h3>
      <p>{content}</p>
      <button className="custom-close-button" onClick={handleCloseClick}>
        Cerrar
      </button>
    </div>
  );
}

export default CustomPopup;
