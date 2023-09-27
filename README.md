
# Nombre del Proyecto

Proyecto Final Certified Tech Developer - FindU

## Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

- Node.js
- npm (Administrador de paquetes de Node.js)
- Java (para el backend)
- Git (opcional, pero recomendado)

## Configuración del Backend

1. Clona este repositorio en tu computadora:
   
   git clone https://github.com/TuUsuario/TuRepositorio.git

2. Copia el archivo application.example.yml y pégalo en la misma ubicación, luego cámbiale el nombre a application.yml.

3. Abre application.yml y modifica los datos de username y password en la sección datasource según tus preferencias.

4. Cambia ddl-auto: create por ddl-auto: update si deseas actualizar la base de datos en lugar de recrearla cada vez.


## Configuración del Frontend

1. Ve al directorio del frontend desde la terminal
   cd findu-front

2. Copia el archivo .env.example y pégalo en la carpeta findu-front, luego cámbiale el nombre a .env.

3. En la terminal, ubícate en la carpeta findu-front y ejecuta:
   npm install

## Ejecución

1. Desde la terminal, ubícate en la carpeta findu-front y ejecuta:
   npm run dev
   
3. En el backend, ejecuta la aplicación (por ejemplo, FinduBackApplication) para iniciar el servidor.

## Acceso

Después de seguir los pasos anteriores, podrás acceder a la aplicación en tu navegador en la siguiente dirección:

Frontend: http://localhost:3000
Backend: http://localhost:puerto (puerto configurado en application.yml)
¡Listo! Ahora deberías tener el proyecto en funcionamiento en tu entorno local. 
