// Importa las dependencias necesarias
const express = require('express');
const session = require('express-session');
const bcryptjs = require('bcryptjs');
const db = require('./conexion');
const dotenv = require('dotenv');

// Carga las variables de entorno
dotenv.config();

// Define la clave secreta para las sesiones
const sessionSecret = process.env.SESSION_SECRET || 'secret';

// Configura el middleware de sesiones
const app = express();
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hora
    },
}));


// Función para registrar un nuevo alumno
async function crearAlumno(req, res) {
    const { numeroControl, nombre, contraseña, carrera, roleId } = req.body;

    try {
        // Verifica si el alumno ya existe
        const [existingAlumno] = await db.promise().query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numeroControl]);
        if (existingAlumno.length > 0) {
            return res.status(400).json({ error: 'El número de control ya está en uso' });
        }

        // Encripta la contraseña
        const hashedPassword = await bcryptjs.hash(contraseña, 10); //j

        // Inserta el nuevo alumno en la base de datos
        await db.promise().query(
            'INSERT INTO Alumno (NumeroControl, Nombre, Contraseña, Carrera, RoleID) VALUES (?, ?, ?, ?, ?)',
            [numeroControl, nombre, hashedPassword, carrera, roleId]
        );

        // Responde con éxito
        res.json({ success: true });
    } catch (error) {
        console.error('Error al crear un nuevo alumno:', error);
        res.status(500).json({ error: 'Error al crear un nuevo alumno' });
    }
}

// Función para registrar un nuevo maestro
async function crearMaestro(req, res) {
    const { rfc, nombre, contraseña, departamentoId, roleId } = req.body;

    try {
        // Verifica si el maestro ya existe
        const [existingMaestro] = await db.promise().query('SELECT * FROM Profesores WHERE RFC = ?', [rfc]);
        if (existingMaestro.length > 0) {
            return res.status(400).json({ error: 'El RFC ya está en uso' });
        }

        // Encripta la contraseña
        const hashedPassword = await bcryptjs.hash(contraseña, 10);

        // Inserta el nuevo maestro en la base de datos
        await db.promise().query(
            'INSERT INTO Profesores (RFC, Nombre, Contraseña, DepartamentoID, RoleID) VALUES (?, ?, ?, ?, ?)',
            [rfc, nombre, hashedPassword, departamentoId, roleId]
        );

        // Responde con éxito
        res.json({ success: true });
    } catch (error) {
        console.error('Error al crear un nuevo maestro:', error);
        res.status(500).json({ error: 'Error al crear un nuevo maestro' });
    }
}

// Función para autenticar a un alumno
async function autenticarAlumno(req, res) {
    const { numeroControl, password } = req.body;

    try {
        const [alumno] = await db.promise().query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numeroControl]);
        if (!alumno || alumno.length === 0) {
            return res.status(401).json({ error: 'Alumno no encontrado' });
        }

        const match = await bcryptjs.compare(password, alumno[0].Contraseña);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Almacena el ID del alumno y el rol en la sesión
        req.session.numeroControl = alumno[0].NumeroControl;
        req.session.userRole = 'alumno';

        // Responde con éxito
        res.json({ success: true });
    } catch (error) {
        console.error('Error al autenticar alumno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para autenticar a un maestro
async function autenticarMaestro(req, res) {
    const { rfc, password } = req.body;

    try {
        const [maestro] = await db.promise().query('SELECT * FROM Profesores WHERE RFC = ?', [rfc]);
        if (!maestro || maestro.length === 0) {
            return res.status(401).json({ error: 'Maestro no encontrado' });
        }

        const match = await bcryptjs.compare(password, maestro[0].Contraseña);
        console.log('Cuerpo de la solicitud:', req.body);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Almacena el ID del maestro y el rol en la sesión
        req.session.rfc = maestro[0].RFC;
        req.session.userRole = 'maestro';

        // Responde con éxito
        res.json({ success: true });
    } catch (error) {
        console.error('Error al autenticar maestro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Middleware para verificar si un usuario está autenticado
function verificarAutenticacionAlumno(req, res, next) {
    if (!req.session.NumeroControl) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    next();
}

// Middleware para verificar si un usuario está autenticado
function verificarAutenticacionMaestro(req, res, next) {
    if (!req.session.rfc) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    next();
}

// Ejemplo de cómo usar el middleware en una ruta protegida
app.get('/ruta-protegidaalumno', verificarAutenticacionAlumno, (req, res) => {
    // Lógica de la ruta protegida
    res.json({ mensaje: 'Has accedido a una ruta protegida' });
});

// Ejemplo de cómo usar el middleware en una ruta protegida
app.get('/ruta-protegidamaestro', verificarAutenticacionMaestro, (req, res) => {
    // Lógica de la ruta protegida
    res.json({ mensaje: 'Has accedido a una ruta protegida' });
});


// Exportar las funciones
module.exports = {
    autenticarAlumno,
    autenticarMaestro,
    crearAlumno,
    crearMaestro,
};
