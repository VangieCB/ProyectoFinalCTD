import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdminPanel.css'

const AdminPanel = () => {

  return (

    <div className='admin-panel-container'>
        <div id='admin-panel'>
            <h2>Panel Administrador</h2>
        </div>
        <div className='element-container'>
            <div className='element'>
                <p>Eventos</p>
                <Link to='/adminEvent'>
                <button>VER</button>
                </Link>
            </div>
            <div className='element'>
                <p>Características</p>
                <Link to='/adminFeatures'>
                <button>VER</button>
                </Link>
            </div>
            <div className='element'>
                <p>Categorías</p>
                <Link to='/adminCat'>
                <button>VER</button>
                </Link>
            </div>
            <div className='element'>
                <p>Usuarios</p>
                <Link to='/users'>
                <button>VER</button>
                </Link>
            </div>
                
        </div>

    </div>

  )
}

export default AdminPanel