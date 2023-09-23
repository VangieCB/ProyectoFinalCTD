import React, { useState, useEffect } from 'react';
import '../../styles/Users.css';
import ToggleSwitch from '../../utils/ToggleSwitch';


const Users = () => {
  const [usuarios, setUsuarios] = useState({ content: [] });

  useEffect(() => {
    // Realiza una solicitud para obtener la lista de usuarios con sus roles
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users?page=1`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        setUsuarios(data); // Almacena la lista de usuarios en el estado
      })
      .catch(error => {
        console.error('Error al obtener la lista de usuarios:', error);
      });
  }, []);

  const handleRoleToggle = (userId, newRole) => {
    // Realiza una solicitud para actualizar el rol del usuario
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }), // Enviar el nuevo rol
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar el rol del usuario');
        }
        // Actualiza el estado local si la solicitud es exitosa
        const updatedUsuarios = usuarios.content.map(usuario =>
          usuario.id === userId ? { ...usuario, role: newRole } : usuario
        );
        setUsuarios({ ...usuarios, content: updatedUsuarios });
      })
      .catch(error => {
        console.error('Error al actualizar el rol del usuario:', error);
      });
  };

  const usuariosFiltrados = usuarios.content.filter(usuario => usuario.firstName !== 'Admin');

  return (
    <div className='users-container'>
      <div id='usuarios'>
        <h2>USUARIOS</h2>
      </div>
      <div className='element-container'>
        {usuariosFiltrados.map(usuario => (
          <div key={usuario.id} className='element'>
            <p>{usuario.firstName}</p>
            <ToggleSwitch
              isOn={usuario.role === 'ADMIN'}
              handleToggle={() => {
                const newRole = usuario.role === 'ADMIN' ? 'CLIENT' : 'ADMIN';
                handleRoleToggle(usuario.id, newRole);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;