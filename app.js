const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const cors = require('cors');
const router = require('./routes');
const { autenticarAlumno } = require('./routes/auth');
const app = express();
// Configura middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

// Configura rutas
app.use('/', routes); // Utiliza el middleware de las rutas
const port = process.env.PORT || 3002;

const { autenticarMaestro, crearAlumno, crearMaestro } = require('./routes/auth');


// Rutas de autenticación
router.post('/login/alumno', autenticarAlumno);
router.post('/login/maestro', autenticarMaestro);
router.post('/login/crear/maestro', crearMaestro);
router.post('/login/crear/alumno', crearAlumno);

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
