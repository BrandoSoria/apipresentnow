const pool = require('./conexion');
const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

const zonaHorariaLocal = 'America/Mexico_City';



// Ruta de bienvenida
router.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido a la API REST de Node.js Express!' });
});

  
// Endpoint para registrar asistencia
router.post('/asistencia', async (req, res) => {
    try {
        const horaActual = moment().format('YYYY-MM-DD HH:mm:ss');
        const { alumnoId, presente } = req.body;
        await pool.execute('INSERT INTO Asistencia (AlumnoID, Fecha, Presente) VALUES (?, ?, ?)', [alumnoId, horaActual, presente]);
        res.status(200).send('Asistencia registrada exitosamente');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Endpoint para obtener asistencias de alumnos
router.get('/asistencia/alumno', async (req, res) => {
    try {
        const [asistencias] = await pool.execute('SELECT * FROM Asistencia');
        const asistenciasFormateadas = asistencias.map(asistencia => {
            const fechaHoraLocal = moment(asistencia.fecha_hora).tz(zonaHorariaLocal).format('YYYY-MM-DD HH:mm:ss');
            return {
                id: asistencia.id,
                AlumnoID: asistencia.alumnoId,
                fecha_hora: fechaHoraLocal,
                presente: asistencia.presente,
            };
        });
        res.json(asistenciasFormateadas);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Endpoint para registrar entrada de profesores
router.post('/entrada/profesores', (req, res) => {
    const { profesorRFC, fechaHora, entro } = req.body;
    pool.query('INSERT INTO EntradaMestro (ProfesorRFC, FechaHora, Entro) VALUES (?, ?, ?)', [profesorRFC, fechaHora, entro], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al registrar entrada del profesor' });
        }
        res.status(201).json({ message: 'Entrada del Profesor creada correctamente' });
    });
});

// Endpoint para registrar salida de profesores
router.post('/salida/profesores', (req, res) => {
    const { profesorRFC, fechaHora, salio } = req.body;
    pool.query('INSERT INTO SalidaMestro (ProfesorRFC, FechaHora, Salio) VALUES (?, ?, ?)', [profesorRFC, fechaHora, salio], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al registrar salida del profesor' });
        }
        res.status(201).json({ message: 'Salida del Profesor creada correctamente' });
    });
});


    // Actualizar un profesor existente
    router.put('/profesores/:rfc', (request, response) => {
        const rfc = request.params.rfc;
        const { nombre, departamento } = request.body;
        pool.query('UPDATE Profesores SET Nombre = ?, Departamento = ? WHERE RFC = ?', [nombre, departamento, rfc], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al actualizar profesor' });
            }
            response.json({ message: 'Profesor actualizado correctamente' });
        });
    });

    // Eliminar un profesor
    router.delete('/profesores/:rfc', (request, response) => {
        const rfc = request.params.rfc;
        pool.query('DELETE FROM Profesores WHERE RFC = ?', [rfc], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al eliminar profesor' });
            }
            response.json({ message: 'Profesor eliminado correctamente' });
        });
    });

   
   router.post('/departamentos', (request, response) => {
    const { nombre } = request.body;
    pool.query('INSERT INTO Departamento (Nombre) VALUES (?)', [nombre], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al crear departamento' });
        }
        response.status(201).json({ message: 'Departamento creado correctamente' });
    });
});


// // Ruta para obtener un departamento por ID
router.get('especifico/departamentos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('SELECT * FROM Departamento WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al obtener departamento' });
        }
        if (results.length === 0) {
            return response.status(404).json({ error: 'Departamento no encontrado' });
        }
        response.status(200).json(results[0]);
    });
});

// Define más rutas aquí usando `router`...

// // Maneja los errores para los métodos PUT, DELETE, POST
// router.put('/departamentos/:id', (request, response) => {
//     const id = request.params.id;
//     const { nombre } = request.body;
//     pool.query('UPDATE Departamento SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: 'Error al actualizar departamento' });
//         }
//         response.status(200).json({ message: 'Departamento actualizado correctamente' });
//     });
// });

router.delete('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM Departamento WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al eliminar departamento' });
        }
        response.status(200).json({ message: 'Departamento eliminado correctamente' });
    });
});
   
    // Actualizar una materia existente
    router.put('/materias/:clave', (request, response) => {
        const clave = request.params.clave;
        const { nombre, creditos } = request.body;
        pool.query('UPDATE Materia SET NombreMateria = ?, Semestre = ?, PlanEstudioId = ?, HoraInicio = ?, ProfesorRFC = ?, NumeroControl = ?  WHERE ClaveMateria = ?', [nombre, creditos, clave], (error, result) => {
            if (error) throw error;
            response.send('Materia actualizada correctamente');
        });
    });
    
    // Eliminar una materia
    router.delete('/materias/:clave', (request, response) => {
        const clave = request.params.clave;
        pool.query('DELETE FROM Materia WHERE ClaveMateria = ?', [clave], (error, result) => {
            if (error) throw error;
            response.send('Materia eliminada correctamente');
        });
    });
    
    // Crear un nuevo plan de estudio
    router.post('/planesestudio', (request, response) => {
        const { nombrePlan, cicloEscolar } = request.body;
        pool.query('INSERT INTO PlanEstudio (NombrePlan, CicloEscolar) VALUES (?, ?)', [ nombrePlan, cicloEscolar], (error, result) => {
            if (error) throw error;
            response.send('Plan de estudio creado correctamente');
        });
    });
    
    // Actualizar un plan de estudio existente
    router.put('/planesestudio/:id', (request, response) => {
        const id = request.params.id;
        const { nombre } = request.body;
        pool.query('UPDATE PlanEstudio SET NombrePlan = ?, CicloEscolar = ? WHERE id = ?', [nombre, id], (error, result) => {
            if (error) throw error;
            response.send('Plan de estudio actualizado correctamente');
        });
    });
    
    // Eliminar un plan de estudio
    router.delete('/planesestudio/:id', (request, response) => {
        const id = request.params.id;
        pool.query('DELETE FROM PlanEstudio WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('Plan de estudio eliminado correctamente');
        });
    });
    
    // // Crear un nuevo alumno
    // router.post('/alumnos', (request, response) => {
    //     const { numeroControl, nombre, carrera } = request.body;
    //     pool.query('INSERT INTO Alumno (NumeroControl, Nombre, Carrera) VALUES (?, ?, ?)', [numeroControl, nombre, carrera], (error, result) => {
    //         if (error) throw error;
    //         response.send('Alumno creado correctamente');
    //     });
    // });
    
    // Actualizar un alumno existente
    router.put('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        const { nombre, carrera } = request.body;
        pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol], (error, result) => {
            if (error) throw error;
            response.send('Alumno actualizado correctamente');
        });
    });
    
    // Eliminar un alumno
    router.delete('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
            if (error) throw error;
            response.send('Alumno eliminado correctamente');
        });
    });
    
    // Crear un nuevo grupo
    router.post('/grupos', (request, response) => {
        const { nombre, capacidad } = request.body;
        pool.query('INSERT INTO Grupo (Nombre, Capacidad) VALUES (?, ?)', [nombre, capacidad], (error, result) => {
            if (error) throw error;
            response.send('Grupo creado correctamente');
        });
    });
    
    // Actualizar un grupo existente
    router.put('/grupos/:id', (request, response) => {
        const id = request.params.id;
        const { nombre, capacidad } = request.body;
        pool.query('UPDATE Grupo SET Nombre = ?, Capacidad = ? WHERE id = ?', [nombre, capacidad, id], (error, result) => {
            if (error) throw error;
            response.send('Grupo actualizado correctamente');
        });
    });
    
    // Eliminar un grupo
    router.delete('/grupos/:id', (request, response) => {
        const id = request.params.id;
        pool.query('DELETE FROM Grupo WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('Grupo eliminado correctamente');
        });
    });

    // Obtener una asistencia por su ID
    router.get('/asistencia/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM Asistencia WHERE id = ?', id, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results);
        });
    });
    
    

        

// Crear un nuevo departamento
router.post('/departamentos', (request, response) => {
    const { nombre } = request.body;
    pool.query('INSERT INTO Departamento (Nombre) VALUES (?)', [nombre], (error, result) => {
        if (error) throw error;
        response.send('Departamento creado correctamente');
    });
});

// Actualizar un departamento existente
router.put('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    const { nombre } = request.body;
    pool.query('UPDATE Departamento SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
        if (error) throw error;
        response.send('Departamento actualizado correctamente');
    });
});

// Eliminar un departamento
router.delete('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM Departamento WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Departamento eliminado correctamente');
    });
});

// Crear una nueva materia
//tabla nueva definitiva
router.post('/materias', (request, response) => {
    const { claveMateria, nombre, semestre, planEstudioId, horaInicio, profesorRfc, numeroControl } = request.body;
    pool.query('INSERT INTO Materia (ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl) VALUES (?, ?, ?, ?, ?, ?, ?)', [claveMateria, nombre, semestre, planEstudioId, fechaHora, profesorRfc, numeroControl], (error, result) => {
        if (error) throw error;
        response.send('Materia creada correctamente');
    });
});

// Actualizar una materia existente
router.put('/materias/:clave', (request, response) => {
    const clave = request.params.clave;
    const { nombre, semestre, planEstudioId, fechaHora, profesorRfc, numeroControl } = request.body;
    pool.query('UPDATE Materia SET Nombre = ?, Creditos = ? WHERE ClaveMateria = ?', [nombre, semestre, planEstudioId, horaInicio, profesorRfc, numeroControl], (error, result) => {
        if (error) throw error;
        response.send('Materia actualizada correctamente');
    });
});

// Eliminar una materia
router.delete('/materias/:clave', (request, response) => {
    const clave = request.params.clave;
    pool.query('DELETE FROM Materia WHERE ClaveMateria = ?', clave, (error, result) => {
        if (error) throw error;
        response.send('Materia eliminada correctamente');
    });
});

// Crear un nuevo plan de estudio
router.post('/planesestudio', (request, response) => {
    const { nombre, cicloEscolar } = request.body;
    pool.query('INSERT INTO PlanEstudio (Nombre, CicloEscolar) VALUES (?)', [nombre,cicloEscolar], (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio creado correctamente');
    });
});

// Actualizar un plan de estudio existente
router.put('/planesestudio/:id', (request, response) => {
    const id = request.params.id;
    const { nombre } = request.body;
    pool.query('UPDATE PlanEstudio SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio actualizado correctamente');
    });
});

// Eliminar un plan de estudio
router.delete('/planesestudio/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM PlanEstudio WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio eliminado correctamente');
    });
});

// Crear un nuevo alumno
router.post('/alumnos', (request, response) => {
    const { numeroControl, nombre, carrera } = request.body;
    pool.query('INSERT INTO Alumno (NumeroControl, Nombre, Carrera) VALUES (?, ?, ?)', [numeroControl, nombre, carrera], (error, result) => {
        if (error) throw error;
        response.send('Alumno creado correctamente');
    });
});

// Actualizar un alumno existente
router.put('/alumnos/:numerocontrol', (request, response) => {
    const numerocontrol = request.params.numerocontrol;
    const { nombre, carrera } = request.body;
    pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol], (error, result) => {
        if (error) throw error;
        response.send('Alumno actualizado correctamente');
    });
});

// Eliminar un alumno
router.delete('/alumnos/:numerocontrol', (request, response) => {
    const numerocontrol = request.params.numerocontrol;
    pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
        if (error) throw error;
        response.send('Alumno eliminado correctamente');
    });
});

// Crear un nuevo grupo
router.post('/grupos', (request, response) => {
    const { nombre, capacidad } = request.body;
    pool.query('INSERT INTO Grupo (Nombre, Capacidad) VALUES (?, ?)', [nombre, capacidad], (error, result) => {
        if (error) throw error;
        response.send('Grupo creado correctamente');
    });
});

// Actualizar un grupo existente
router.put('/grupos/:id', (request, response) => {
    const id = request.params.id;
    const { nombre, capacidad } = request.body;
    pool.query('UPDATE Grupo SET Nombre = ?, Capacidad = ? WHERE id = ?', [nombre, capacidad, id], (error, result) => {
        if (error) throw error;
        response.send('Grupo actualizado correctamente');
    });
});

// Eliminar un grupo
router.delete('/grupos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM Grupo WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Grupo eliminado correctamente');
    });
});



// los get

    // Ruta para obtener todos los profesores
    router.get('/profesores', (req, res) => {
        pool.query('SELECT * FROM Profesores', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener profesores' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los departamentos
    router.get('/departamentos', (req, res) => {
        pool.query('SELECT * FROM Departamento', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener departamentos' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todas las materias
    router.get('/materias', (req, res) => {
        pool.query('SELECT * FROM Materia', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener materias' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los planes de estudio
    router.get('/planesestudio', (req, res) => {
        pool.query('SELECT * FROM PlanEstudio', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener planes de estudio' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los alumnos
    router.get('/alumnos', (req, res) => {
        pool.query('SELECT * FROM Alumno', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener alumnos' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los grupos
    router.get('/grupos', (req, res) => {
        pool.query('SELECT * FROM Grupo', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener grupos' });
            }
            res.status(200).json(results);
        });
    });

   
    // Obtener un profesor por su RFC
    router.get('/profesores/:rfc', (req, res) => {
        const rfc = req.params.rfc;
        pool.query('SELECT * FROM Profesores WHERE RFC = ?', [rfc], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener profesor' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Profesor no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Obtener un departamento por su ID
    router.get('quitar/departamentos/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM Departamento WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener departamento' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Departamento no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Obtener una materia por su clave
    router.get('/materias/:clave', (req, res) => {
        const clave = req.params.clave;
        pool.query('SELECT * FROM Materia WHERE ClaveMateria = ?', [clave], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener materia' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Materia no encontrada' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Obtener un plan de estudio por su ID
    router.get('/planesestudio/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM PlanEstudio WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener plan de estudio' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Plan de estudio no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Obtener un alumno por su número de control
    router.get('/alumnos/:numerocontrol', (req, res) => {
        const numerocontrol = req.params.numerocontrol;
        pool.query('SELECT * FROM Alumno WHERE NumeroControl = ?', [numerocontrol], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener alumno' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Alumno no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Obtener un grupo por su ID
    router.get('/grupos/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM Grupo WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener grupo' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Grupo no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });


// Manejo de errores para métodos no definidos
router.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
});


module.exports = router;