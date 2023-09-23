import { useState, useEffect } from 'react';
import '../../styles/LoginForm.css';
import { Link } from 'react-router-dom'
import Header from '../../utils/Header';


function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    useEffect(() => {
        if (!email.includes('@')) {
            setEmailError('Ingresa un correo electrónico válido');
        } else {
            setEmailError('');
        }

        if (password.length < 6 || !/\d/.test(password)) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres y un número');
        } else {
            setPasswordError('');
        }
    }, [email, password]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (emailError || passwordError) {
            alert("Alguno de los datos ingresados no son correctos: Por favor ingresa un correo electrónico válido y comprueba que la contraseña tenga al menos 6 caracteres y un número.");
            return;
        }


        fetchUser(email, password)

    };



    const fetchUser = async (email, password) => {
        try {
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/authenticate`; // Reemplaza esto con la URL correcta
            const response = await fetch(url, {
                method: 'POST', // Usamos el método POST para enviar datos al servidor
                headers: {
                    'Content-Type': 'application/json', // Indicamos que estamos enviando JSON en el cuerpo
                },
                body: JSON.stringify({ email, password }), // Convertimos los datos en formato JSON
            });

            const data = await response.json(); console.log(data);
            localStorage.setItem('dataUser', JSON.stringify(data)); // Guardamos el token en localStorage para usarlo después
            window.location.href = '/miPerfil';

        } catch (error) {
            console.log(error);
        }
    };

    // Para obtener el token nombre,apello, email y rol : (usuario logueado)
    // JSON.parse(localStorage.getItem("dataUser"))

    return (
        <form onSubmit={handleSubmit}>

            <div className='registro'>
                <label>
                    <h2 className='titulo2'>Iniciar Sesión</h2>
                    <h3 className='titulo'>Correo electrónico</h3>
                    <input type="text" className='input-inicioSesion' placeholder="Escribe tu correo electrónico..." value={email} onChange={handleEmailChange} />
                </label>
                {emailError && <span className='error-message'>{emailError}</span>}
                <br />

                <label>
                    <h3 className='titulo'>Contraseña</h3>
                    <input type="password" className='input-inicioSesion' placeholder="Escribe tu contraseña..." value={password} onChange={handlePasswordChange} />
                </label>
                {passwordError && <span className='error-message'>{passwordError}</span>}
                <br />

                <button type="submit" className='inicioSesionBoton'>Iniciar sesión</button>
                <Link to='/registrarse' style={{ textDecoration: 'none' }}>
                    <button type="submit" className='registroBoton'>Registrarse</button>
                </Link>
                <Header showButtonA={false} showButtonB={false}/>
            </div>

        </form>
    );
}

export default LoginForm;