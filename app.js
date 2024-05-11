const db = require('./routes/conexion');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

//login
// const { autenticarAlumno, autenticarMaestro } = require('../apipresentnow/routes/auth');
const { autenticarAlumno, autenticarMaestro, crearAlumno, crearMaestro } = require('./routes/auth');

const app = express();
app.use(express.json()); // Para manejar solicitudes JSON nuevo codigo de jwt
const port = process.env.PORT || 3002;

// Configura middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

// Configura rutas
routes(app);

// Rutas de autenticación
app.post('/login/alumno', autenticarAlumno);
app.post('/login/maestro', autenticarMaestro);
app.post('/login/crear/maestro', crearMaestro);
app.post('/login/crear/alumno', crearAlumno);

// Maneja rutas no definidas (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Maneja errores
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor
const server = app.listen(port, (error) => {
    if (error) {
        console.error(`Error al iniciar el servidor: ${error}`);
        return;
    }
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
