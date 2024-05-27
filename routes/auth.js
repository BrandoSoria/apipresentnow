// Importa las dependencias necesarias
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const pool = require('./conexion');
const dotenv = require('dotenv');

dotenv.config();

// Definir la clave secreta para JWT
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
    console.error('secretKey no está definida');
    throw new Error('Error: secretOrPrivateKey must have a value');
}

// Función para crear un nuevo alumno
async function crearAlumno(req, res) {
    const { numeroControl, nombre, contraseña, carrera, roleId } = req.body;

    try {
        const [existingAlumno] = await pool.query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numeroControl]);
        if (existingAlumno.length > 0) {
            return res.status(400).json({ error: 'El número de control ya está en uso' });
        }

        const hashedPassword = await bcryptjs.hash(contraseña, 10);

        await pool.query(
            'INSERT INTO Alumno (NumeroControl, Nombre, Contraseña, Carrera, RoleID) VALUES (?, ?, ?, ?, ?)',
            [numeroControl, nombre, hashedPassword, carrera, roleId]
        );

        const token = jwt.sign(
            {
                id: numeroControl,
                roleId: roleId
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al crear un nuevo alumno:', error);
        res.status(500).json({ error: 'Error al crear un nuevo alumno' });
    }
}

//crear administrador
async function crearAdministrador(req, res) {
    const { Credencial, Nombre, contraseña, roleId } = req.body;

    try {
        const [existingAdmon] = await pool.query('SELECT * FROM admon WHERE Credencial = ?', [Credencial]);
        if (existingAdmon.length > 0) {
            return res.status(400).json({ error: 'El administrador con es acredencial ya está en uso' });
        }

        const hashedPassword = await bcryptjs.hash(contraseña, 10);

        await pool.query(
            'INSERT INTO admon (Credencial, Nombre, Contraseña, RoleID) VALUES (?, ?, ?, ?)',
            [Credencial, Nombre, hashedPassword, roleId]
        );

        const token = jwt.sign(
            {
                id: Credencial,
                roleId: roleId
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al crear un nuevo administrador:', error);
        res.status(500).json({ error: 'Error al crear un nuevo administrador' });
    }
}



// Función para autenticar administrador
async function autenticarAdministrador(req, res) {
    const { Credencial, password } = req.body;

    try {
        const [results] = await pool.query('SELECT * FROM admon WHERE Credencial = ?', [Credencial]);
        const admin = results[0];
        if (!admin) {
            return res.status(401).json({ error: 'admin no encontrado' });
        }

        const match = await bcryptjs.compare(password, admin.Contraseña);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const [roleResults] = await pool.query(
            `SELECT Roles.Nombre AS rol, GROUP_CONCAT(Permisos.Nombre) AS permisos
             FROM Roles
             JOIN RolPermiso ON Roles.RoleID = RolPermiso.RoleID
             JOIN Permisos ON RolPermiso.PermisoID = Permisos.PermisoID
             WHERE Roles.RoleID = ?`,
            [admin.RoleID]
        );

        const rol = roleResults[0]?.rol;
        const permisos = roleResults[0]?.permisos;

        const token = jwt.sign(
            {
                id: admin.Credencial,
                role: rol,
                permisos: permisos
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al autenticar administrador:', error);
        res.status(500).json({ error: 'Error al autenticar administrador' });
    }
}


// Función para autenticar alumnos
async function autenticarAlumno(req, res) {
    const { numeroControl, password } = req.body;

    try {
        const [results] = await pool.query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numeroControl]);
        const alumno = results[0];
        if (!alumno) {
            return res.status(401).json({ error: 'Alumno no encontrado' });
        }

        const match = await bcryptjs.compare(password, alumno.Contraseña);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const [roleResults] = await pool.query(
            `SELECT Roles.Nombre AS rol, GROUP_CONCAT(Permisos.Nombre) AS permisos
             FROM Roles
             JOIN RolPermiso ON Roles.RoleID = RolPermiso.RoleID
             JOIN Permisos ON RolPermiso.PermisoID = Permisos.PermisoID
             WHERE Roles.RoleID = ?`,
            [alumno.RoleID]
        );

        const rol = roleResults[0]?.rol;
        const permisos = roleResults[0]?.permisos;

        const token = jwt.sign(
            {
                id: alumno.NumeroControl,
                role: rol,
                permisos: permisos
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al autenticar alumno:', error);
        res.status(500).json({ error: 'Error al autenticar alumno' });
    }
}



// Función para autenticar maestros
async function autenticarMaestro(req, res) {
    const { rfc, password } = req.body;

    try {
        const [results] = await pool.query('SELECT * FROM Profesores WHERE RFC = ?', [rfc]);
        const maestro = results[0];
        if (!maestro) {
            return res.status(401).json({ error: 'Maestro no encontrado' });
        }

        const match = await bcryptjs.compare(password, maestro.Contraseña);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const [roleResults] = await pool.query(
            `SELECT Roles.Nombre AS rol, GROUP_CONCAT(Permisos.Nombre) AS permisos
             FROM Roles
             JOIN RolPermiso ON Roles.RoleID = RolPermiso.RoleID
             JOIN Permisos ON RolPermiso.PermisoID = Permisos.PermisoID
             WHERE Roles.RoleID = ?`,
            [maestro.RoleID]
        );

        const rol = roleResults[0]?.rol;
        const permisos = roleResults[0]?.permisos;

        const token = jwt.sign(
            {
                id: maestro.RFC,
                role: rol,
                permisos: permisos
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al autenticar maestro:', error);
        res.status(500).json({ error: 'Error al autenticar maestro' });
    }
}

// Función para crear un nuevo maestro
async function crearMaestro(req, res) {
    const { rfc, nombre, contraseña, departamentoId, roleId } = req.body;

    try {
        const [existingMaestro] = await pool.query('SELECT * FROM Profesores WHERE RFC = ?', [rfc]);
        if (existingMaestro.length > 0) {
            return res.status(400).json({ error: 'El RFC ya está en uso' });
        }

        const hashedPassword = await bcryptjs.hash(contraseña, 10);

        await pool.query(
            'INSERT INTO Profesores (RFC, Nombre, Contraseña, DepartamentoID, RoleID) VALUES (?, ?, ?, ?, ?)',
            [rfc, nombre, hashedPassword, departamentoId, roleId]
        );

        const token = jwt.sign(
            {
                id: rfc,
                roleId: roleId
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al crear un nuevo maestro:', error);
        res.status(500).json({ error: 'Error al crear un nuevo maestro' });
    }
}

// Exportar las funciones
module.exports = {
    autenticarAlumno,
    autenticarMaestro,
    crearAlumno,
    crearMaestro,
    crearAdministrador,
    autenticarAdministrador
};
