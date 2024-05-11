const express = require('express');
const pool = require('./conexion');
const moment = require('moment-timezone');  // Importa moment-timezone

const router = express.Router();

router.get('/', (request, response) => {
    response.json({
        message: '¡Bienvenido a la API REST de Node.js Express!'
    });
});

    // Crear un nuevo profesor
    router.post('/profesores', (request, response) => {
        const { nombre, rfc, departamento } = request.body;
        pool.query('INSERT INTO Profesores (Nombre, RFC, Departamento) VALUES (?, ?, ?)', [nombre, rfc, departamento], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al crear profesor' });
            }
            response.status(201).json({ message: 'Profesor creado correctamente' });
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

   // Ruta para crear un nuevo departamento
  
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


// Ruta para obtener un departamento por ID
router.get('/departamentos/:id', (request, response) => {
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

// Maneja los errores para los métodos PUT, DELETE, POST
router.put('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    const { nombre } = request.body;
    pool.query('UPDATE Departamento SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al actualizar departamento' });
        }
        response.status(200).json({ message: 'Departamento actualizado correctamente' });
    });
});

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
    
    // Crear una nueva materia
    router.post('/materias', (request, response) => {
        const { claveMateria, nombre, creditos } = request.body;
        pool.query('INSERT INTO Materia (ClaveMateria, Nombre, Creditos) VALUES (?, ?, ?)', [claveMateria, nombre, creditos], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al crear materia' });
            }
            response.status(201).json({ message: 'Materia creada correctamente' });
            
        });
    });
    
    // Actualizar una materia existente
    router.put('/materias/:clave', (request, response) => {
        const clave = request.params.clave;
        const { nombre, creditos } = request.body;
        pool.query('UPDATE Materia SET Nombre = ?, Creditos = ? WHERE ClaveMateria = ?', [nombre, creditos, clave], (error, result) => {
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
        const { nombre } = request.body;
        pool.query('INSERT INTO PlanEstudio (Nombre) VALUES (?)', [nombre], (error, result) => {
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
    
   
// Configura la zona horaria local (México)
const zonaHorariaLocal = 'America/Mexico_City';

router.get('/', async (req, res) => {
  try {
    const [asistencias] = await pool.execute('SELECT * FROM asistencias');
    
    // Formatear y convertir las fechas a la zona horaria local
    const asistenciasFormateadas = asistencias.map(asistencia => {
      // Convierte `fecha_hora` a la zona horaria local
      const fechaHoraLocal = moment(asistencia.fecha_hora)
        .tz(zonaHorariaLocal)  // Convierte a la zona horaria local
        .format('YYYY-MM-DD HH:mm:ss');  // Formatea la fecha y hora
      
      return {
        id: asistencia.id,
        AlumnoID: asistencia.alumnoID,
        Fecha: fechaHoraLocal,  // Utiliza la fecha y hora local
        Presente: asistencia.Presente,
      };
    });

    res.json(asistenciasFormateadas);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});


    
    // Obtener una asistencia por su ID
    router.get('/asistencias/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM Asistencia WHERE id = ?', id, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results);
        });
    });
    
    // Crear una nueva asistencia
    router.post('/asistencias', (req, res) => {
        const { AlumnoID, Fecha, Presente } = req.body;
        pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente) VALUES (?, ?, ?)', [AlumnoID, Fecha, Presente], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Asistencia añadida con ID: ${results.insertId}`);
        });
    });
    
    // Actualizar una asistencia
    router.put('/asistencias/:id', (req, res) => {
        const id = req.params.id;
        const { AlumnoID, Fecha, Presente } = req.body;
        pool.query('UPDATE Asistencia SET AlumnoID = ?, Fecha = ?, Presente = ? WHERE id = ?', [AlumnoID, Fecha, Presente, id], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Asistencia modificada con ID: ${id}`);
        });
    });
    
    // Eliminar una asistencia
    router.delete('/asistencias/:id', (req, res) => {
        const id = req.params.id;
        pool.query('DELETE FROM Asistencia WHERE id = ?', id, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Asistencia eliminada con ID: ${id}`);
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
router.post('/materias', (request, response) => {
    const { claveMateria, nombre, creditos } = request.body;
    pool.query('INSERT INTO Materia (ClaveMateria, Nombre, Creditos) VALUES (?, ?, ?)', [claveMateria, nombre, creditos], (error, result) => {
        if (error) throw error;
        response.send('Materia creada correctamente');
    });
});

// Actualizar una materia existente
router.put('/materias/:clave', (request, response) => {
    const clave = request.params.clave;
    const { nombre, creditos } = request.body;
    pool.query('UPDATE Materia SET Nombre = ?, Creditos = ? WHERE ClaveMateria = ?', [nombre, creditos, clave], (error, result) => {
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
    const { nombre } = request.body;
    pool.query('INSERT INTO PlanEstudio (Nombre) VALUES (?)', [nombre], (error, result) => {
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

// Obtener todas las asistencias
router.get('/asistencias', (req, res) => {
    pool.query('SELECT * FROM Asistencia', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results);
    });
});

// Obtener una asistencia por su ID
router.get('/asistencias/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM Asistencia WHERE id = ?', id, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results);
    });
});

// Crear una nueva asistencia
router.post('/asistencias', (req, res) => {
    const { AlumnoID, Fecha, Presente } = req.body;
    pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente) VALUES (?, ?, ?)', [AlumnoID, Fecha, Presente], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Asistencia añadida con ID: ${results.insertId}`);
    });
});

// Actualizar una asistencia
router.put('/asistencias/:id', (req, res) => {
    const id = req.params.id;
    const { AlumnoID, Fecha, Presente } = req.body;
    pool.query('UPDATE Asistencia SET AlumnoID = ?, Fecha = ?, Presente = ? WHERE id = ?', [AlumnoID, Fecha, Presente, id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Asistencia modificada con ID: ${id}`);
    });
});

// Eliminar una asistencia
router.delete('/asistencias/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM Asistencia WHERE id = ?', id, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Asistencia eliminada con ID: ${id}`);
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

    // Ruta para obtener todas las asistencias
    router.get('/asistencias', (req, res) => {
        pool.query('SELECT * FROM Asistencia', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener asistencias' });
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
    router.get('/departamentos/:id', (req, res) => {
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

    // Obtener una asistencia por su ID
    router.get('/asistencias/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM Asistencia WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener asistencia' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Asistencia no encontrada' });
            }
            res.status(200).json(results[0]);
        });
    });

module.exports = router;