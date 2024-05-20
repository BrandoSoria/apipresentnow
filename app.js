// Importar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar las rutas y controladores
const routes = require('./routes/routes');
const alumnos = require('./routes/models/alumno');
const maestros = require('./routes/models/maestro');
const { autenticarAlumno, autenticarMaestro, crearAlumno, crearMaestro } = require('./routes/auth');

// Crear instancia de la aplicación Express
const app = express();

// Configuración del puerto
const port = process.env.PORT || 3002;

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());

// Configurar rutas
routes(app);
maestros(app);
alumnos(app);

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
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        // Error de conexión a la base de datos
        return res.status(500).json({ error: 'Error interno del servidor: Conexión a la base de datos cerrada' });
    }
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

module.exports = app; // Para facilitar pruebas y reutilización
