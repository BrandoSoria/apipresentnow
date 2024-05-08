const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./conexion');

const secretKey = process.env.SECRET_KEY;

// Función para autenticar a un alumno
async function autenticarAlumno(req, res) {
    const { numeroControl, password } = req.body;

    // Consulta para encontrar al alumno
    db.query(
        'SELECT * FROM Alumno WHERE NumeroControl = ?',
        [numeroControl],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la base de datos' });
            }

            const alumno = results[0];
            if (!alumno) {
                return res.status(401).json({ error: 'Alumno no encontrado' });
            }

            // Comparar contraseñas
            const match = await bcrypt.compare(password, alumno.Contraseña);
            if (!match) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Obtener rol y permisos del alumno
            db.query(
                `SELECT Roles.Nombre AS rol, GROUP_CONCAT(Permisos.Nombre) AS permisos
                 FROM Roles
                 JOIN RolPermiso ON Roles.RoleID = RolPermiso.RoleID
                 JOIN Permisos ON RolPermiso.PermisoID = Permisos.PermisoID
                 WHERE Roles.RoleID = ?`,
                [alumno.RoleID],
                (err, roleResults) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error en la base de datos' });
                    }

                    const rol = roleResults[0]?.rol;
                    const permisos = roleResults[0]?.permisos;

                    // Crear JWT
                    const token = jwt.sign(
                        {
                            id: alumno.NumeroControl,
                            role: rol,
                            permisos: permisos
                        },
                        secretKey,
                        { expiresIn: '1h' }
                    );

                    // Respuesta con el token JWT
                    res.json({ token });
                }
            );
        }
    );
}

// Función para autenticar a un maestro
async function autenticarMaestro(req, res) {
    const { rfc, password } = req.body;

    // Consulta para encontrar al maestro
    db.query(
        'SELECT * FROM Profesores WHERE RFC = ?',
        [rfc],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la base de datos' });
            }

            const maestro = results[0];
            if (!maestro) {
                return res.status(401).json({ error: 'Maestro no encontrado' });
            }

            // Comparar contraseñas
            const match = await bcrypt.compare(password, maestro.Contraseña);
            if (!match) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Obtener rol y permisos del maestro
            db.query(
                `SELECT Roles.Nombre AS rol, GROUP_CONCAT(Permisos.Nombre) AS permisos
                 FROM Roles
                 JOIN RolPermiso ON Roles.RoleID = RolPermiso.RoleID
                 JOIN Permisos ON RolPermiso.PermisoID = Permisos.PermisoID
                 WHERE Roles.RoleID = ?`,
                [maestro.RoleID],
                (err, roleResults) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error en la base de datos' });
                    }

                    const rol = roleResults[0]?.rol;
                    const permisos = roleResults[0]?.permisos;

                    // Crear JWT
                    const token = jwt.sign(
                        {
                            id: maestro.RFC,
                            role: rol,
                            permisos: permisos
                        },
                        secretKey,
                        { expiresIn: '1h' }
                    );

                    // Respuesta con el token JWT
                    res.json({ token });
                }
            );
        }
    );
}

// Función para crear un nuevo alumno
async function crearAlumno(req, res) {
    const { numeroControl, nombre, contraseña, carrera, roleId } = req.body;

    try {
        // Verifica si el alumno ya existe
        const [existingAlumno] = await db.promise().query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numeroControl]);
        if (existingAlumno.length > 0) {
            return res.status(400).json({ error: 'El número de control ya está en uso' });
        }

        // Encripta la contraseña
        const hashedPassword = await bcryptjs.hash(contraseña, 10);

        // Inserta el nuevo alumno en la base de datos
        await db.promise().query(
            'INSERT INTO Alumno (NumeroControl, Nombre, Contraseña, Carrera, RoleID) VALUES (?, ?, ?, ?, ?)',
            [numeroControl, nombre, hashedPassword, carrera, roleId]
        );

        // Genera un token JWT para el nuevo alumno
        const token = jwt.sign(
            {
                id: numeroControl,
                roleId: roleId
            },
            secretKey,
            { expiresIn: '1h' }
        );

        // Responde con el token JWT
        res.json({ token });
    } catch (error) {
        console.error('Error al crear un nuevo alumno:', error);
        res.status(500).json({ error: 'Error al crear un nuevo alumno' });
    }
}

// Función para crear un nuevo maestro
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

        // Genera un token JWT para el nuevo maestro
        const token = jwt.sign(
            {
                id: rfc,
                roleId: roleId
            },
            secretKey,
            { expiresIn: '1h' }
        );

        // Responde con el token JWT
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
