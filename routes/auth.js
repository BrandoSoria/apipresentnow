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

// Función para autenticar alumnos
// ademas de solo mostrar las materias en las que esta ese alumno que inicio sesion
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

        // Debugging: Imprimir los resultados de la consulta SQL
        console.log('Resultados de la consulta de materias:', results);

        // Consulta para obtener las materias del alumno
        const [materiasResults] = await pool.query(
            `SELECT Materias.ClaveMateria, Materias.NombreMateria
             FROM AlxGpo
             JOIN Grupo ON AlxGpo.IdGrupo = Grupo.IdGrupo
             JOIN Materias ON Grupo.Id_Materia = Materias.ClaveMateria
             WHERE AlxGpo.NumeroControl = ?`,
            [numeroControl]
        );

        // Obtener las materias como un arreglo de objetos { ClaveMateria, NombreMateria }
        const materias = materiasResults.map(row => ({
            ClaveMateria: row.ClaveMateria,
            NombreMateria: row.NombreMateria
        }));

        // Debugging: Imprimir las materias obtenidas
        console.log('Materias del alumno:', materias);

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
                permisos: permisos,
                materias: materias // Incluir las materias en el token
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
};
