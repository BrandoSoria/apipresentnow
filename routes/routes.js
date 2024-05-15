const pool = require('./conexion');
const express = require('express');
const moment = require('moment-timezone');


const zonaHorariaLocal = 'America/Mexico_City';


const router = (app) => {
    // Ruta de bienvenida
    app.get('/', (request, response) => {
        response.json({
            message: '¡Bienvenido a la API REST de Node.js Express!'
        });
    });


    
// Endpoint para registrar asistencia
app.post('/asistencia', async (req, res) => {
    try {
      // Obtenemos la hora actual del sistema operativo
      const horaActual = moment().format('YYYY-MM-DD HH:mm:ss');
      
      // Suponiendo que los datos del alumno y la asistencia están en req.body
      const { alumnoId, presente } = req.body;
  
      // Insertamos la asistencia en la base de datos junto con la hora actual
      await pool.execute('INSERT INTO Asistencia (AlumnoID, Fecha, Presente) VALUES (?, ?, ?, ?)', [alumnoId,horaActual ,presente]);
  
      res.status(200).send('Asistencia registrada exitosamente');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  });
  
  // Endpoint para obtener asistencias
  app.get('/asistencia/alumno', async (req, res) => {
    try {
      const [asistencias] = await pool.execute('SELECT * FROM Asistencia');
      
      const asistenciasFormateadas = asistencias.map(asistencia => {
        // Convierte `fecha_hora` a la zona horaria local
        const fechaHoraLocal = moment(asistencia.fecha_hora)
          .tz(zonaHorariaLocal)
          .format('YYYY-MM-DD HH:mm:ss');
  
        return {
          id: asistencias.id,
          AlumnoID: asistencias.alumnoId,
          fecha_hora: fechaHoraLocal,
          presente: asistencias.presente,
        };
      });
  
      res.json(asistenciasFormateadas);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  });

    // // Crear un nuevo profesor
    // app.post('/profesores', (request, response) => {
    //     const { nombre, rfc, departamento } = request.body;
    //     pool.query('INSERT INTO Profesores (Nombre, RFC, Departamento) VALUES (?, ?, ?)', [nombre, rfc, departamento], (error, result) => {
    //         if (error) {
    //             console.error(error);
    //             return response.status(500).json({ error: 'Error al crear profesor' });
    //         }
    //         response.status(201).json({ message: 'Profesor creado correctamente' });
    //     });
    // });

    //nueva modificacion 2 definitiva
 // post entrada salida de maestro
 app.post('/entrada/profesores', (request, response) => {
    const { profesorRFC, fechaHora, entro } = request.body;
    pool.query('INSERT INTO EntradaMestro (ProfesorRFC, FechaHora, Entro) VALUES (?, ?, ?)', [profesorRFC, fechaHora, entro], (error, result) => {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'Error al crear profesor' });
        }
        response.status(201).json({ message: 'Profesor creado correctamente' });
    });
});



    // post entrada salida de maestro
    app.post('/salida/profesores', (request, response) => {
        const { profesorRFC, fechaHora, salio } = request.body;
        pool.query('INSERT INTO SalidaMestro (ProfesorRFC, FechaHora, Salio) VALUES (?, ?, ?)', [profesorRFC, fechaHora, salio], (error, result) => {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: 'Error al crear profesor' });
            }
            response.status(201).json({ message: 'Profesor creado correctamente' });
        });
    });

    // Actualizar un profesor existente
    app.put('/profesores/:rfc', (request, response) => {
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
    app.delete('/profesores/:rfc', (request, response) => {
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
   const router = (app) => {
   app.post('/departamentos', (request, response) => {
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
app.get('/departamentos/:id', (request, response) => {
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

// Define más rutas aquí usando `app`...

// Maneja los errores para los métodos PUT, DELETE, POST
app.put('/departamentos/:id', (request, response) => {
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

app.delete('/departamentos/:id', (request, response) => {
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
    app.put('/materias/:clave', (request, response) => {
        const clave = request.params.clave;
        const { nombre, creditos } = request.body;
        pool.query('UPDATE Materia SET NombreMateria = ?, Semestre = ?, PlanEstudioId = ?, HoraInicio = ?, ProfesorRFC = ?, NumeroControl = ?  WHERE ClaveMateria = ?', [nombre, creditos, clave], (error, result) => {
            if (error) throw error;
            response.send('Materia actualizada correctamente');
        });
    });
    
    // Eliminar una materia
    app.delete('/materias/:clave', (request, response) => {
        const clave = request.params.clave;
        pool.query('DELETE FROM Materia WHERE ClaveMateria = ?', [clave], (error, result) => {
            if (error) throw error;
            response.send('Materia eliminada correctamente');
        });
    });
    
    // Crear un nuevo plan de estudio
    app.post('/planesestudio', (request, response) => {
        const { nombrePlan, cicloEscolar } = request.body;
        pool.query('INSERT INTO PlanEstudio (NombrePlan, CicloEscolar) VALUES (?, ?)', [ nombrePlan, cicloEscolar], (error, result) => {
            if (error) throw error;
            response.send('Plan de estudio creado correctamente');
        });
    });
    
    // Actualizar un plan de estudio existente
    app.put('/planesestudio/:id', (request, response) => {
        const id = request.params.id;
        const { nombre } = request.body;
        pool.query('UPDATE PlanEstudio SET NombrePlan = ?, CicloEscolar = ? WHERE id = ?', [nombre, id], (error, result) => {
            if (error) throw error;
            response.send('Plan de estudio actualizado correctamente');
        });
    });
    
    // Eliminar un plan de estudio
    app.delete('/planesestudio/:id', (request, response) => {
        const id = request.params.id;
        pool.query('DELETE FROM PlanEstudio WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('Plan de estudio eliminado correctamente');
        });
    });
    
    // // Crear un nuevo alumno
    // app.post('/alumnos', (request, response) => {
    //     const { numeroControl, nombre, carrera } = request.body;
    //     pool.query('INSERT INTO Alumno (NumeroControl, Nombre, Carrera) VALUES (?, ?, ?)', [numeroControl, nombre, carrera], (error, result) => {
    //         if (error) throw error;
    //         response.send('Alumno creado correctamente');
    //     });
    // });
    
    // Actualizar un alumno existente
    app.put('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        const { nombre, carrera } = request.body;
        pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol], (error, result) => {
            if (error) throw error;
            response.send('Alumno actualizado correctamente');
        });
    });
    
    // Eliminar un alumno
    app.delete('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
            if (error) throw error;
            response.send('Alumno eliminado correctamente');
        });
    });
    
    // Crear un nuevo grupo
    app.post('/grupos', (request, response) => {
        const { nombre, capacidad } = request.body;
        pool.query('INSERT INTO Grupo (Nombre, Capacidad) VALUES (?, ?)', [nombre, capacidad], (error, result) => {
            if (error) throw error;
            response.send('Grupo creado correctamente');
        });
    });
    
    // Actualizar un grupo existente
    app.put('/grupos/:id', (request, response) => {
        const id = request.params.id;
        const { nombre, capacidad } = request.body;
        pool.query('UPDATE Grupo SET Nombre = ?, Capacidad = ? WHERE id = ?', [nombre, capacidad, id], (error, result) => {
            if (error) throw error;
            response.send('Grupo actualizado correctamente');
        });
    });
    
    // Eliminar un grupo
    app.delete('/grupos/:id', (request, response) => {
        const id = request.params.id;
        pool.query('DELETE FROM Grupo WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('Grupo eliminado correctamente');
        });
    });
    
    // // Obtener todas las asistencias
    // app.get('/asistencias', (req, res) => {
    //     pool.query('SELECT * FROM Asistencia', (error, results) => {
    //         if (error) {
    //             throw error;
    //         }
    //         res.status(200).json(results);
    //     });
    // });
    
    // Obtener una asistencia por su ID
    app.get('/asistencias/:id', (req, res) => {
        const id = req.params.id;
        pool.query('SELECT * FROM Asistencia WHERE id = ?', id, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results);
        });
    });
    
    // // Crear una nueva asistencia
    // app.post('/asistencias', (req, res) => {
    //     const { AlumnoID, Fecha, Presente } = req.body;
    //     pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente) VALUES (?, ?, ?)', [AlumnoID, Fecha, Presente], (error, results) => {
    //         if (error) {
    //             throw error;
    //         }
    //         res.status(201).send(`Asistencia añadida con ID: ${results.insertId}`);
    //     });
    // });
  

    
    
    }
        

// Crear un nuevo departamento
app.post('/departamentos', (request, response) => {
    const { nombre } = request.body;
    pool.query('INSERT INTO Departamento (Nombre) VALUES (?)', [nombre], (error, result) => {
        if (error) throw error;
        response.send('Departamento creado correctamente');
    });
});

// Actualizar un departamento existente
app.put('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    const { nombre } = request.body;
    pool.query('UPDATE Departamento SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
        if (error) throw error;
        response.send('Departamento actualizado correctamente');
    });
});

// Eliminar un departamento
app.delete('/departamentos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM Departamento WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Departamento eliminado correctamente');
    });
});

// Crear una nueva materia
//tabla nueva definitiva
app.post('/materias', (request, response) => {
    const { claveMateria, nombre, semestre, planEstudioId, horaInicio, profesorRfc, numeroControl } = request.body;
    pool.query('INSERT INTO Materia (ClaveMateria, NombreMateria, Semestre, PlanEstudioId, HoraInicio, ProfesorRFC, NumeroControl) VALUES (?, ?, ?, ?, ?, ?, ?)', [claveMateria, nombre, semestre, planEstudioId, fechaHora, profesorRfc, numeroControl], (error, result) => {
        if (error) throw error;
        response.send('Materia creada correctamente');
    });
});

// Actualizar una materia existente
app.put('/materias/:clave', (request, response) => {
    const clave = request.params.clave;
    const { nombre, semestre, planEstudioId, fechaHora, profesorRfc, numeroControl } = request.body;
    pool.query('UPDATE Materia SET Nombre = ?, Creditos = ? WHERE ClaveMateria = ?', [nombre, semestre, planEstudioId, horaInicio, profesorRfc, numeroControl], (error, result) => {
        if (error) throw error;
        response.send('Materia actualizada correctamente');
    });
});

// Eliminar una materia
app.delete('/materias/:clave', (request, response) => {
    const clave = request.params.clave;
    pool.query('DELETE FROM Materia WHERE ClaveMateria = ?', clave, (error, result) => {
        if (error) throw error;
        response.send('Materia eliminada correctamente');
    });
});

// Crear un nuevo plan de estudio
app.post('/planesestudio', (request, response) => {
    const { nombre, cicloEscolar } = request.body;
    pool.query('INSERT INTO PlanEstudio (Nombre, CicloEscolar) VALUES (?)', [nombre,cicloEscolar], (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio creado correctamente');
    });
});

// Actualizar un plan de estudio existente
app.put('/planesestudio/:id', (request, response) => {
    const id = request.params.id;
    const { nombre } = request.body;
    pool.query('UPDATE PlanEstudio SET Nombre = ? WHERE id = ?', [nombre, id], (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio actualizado correctamente');
    });
});

// Eliminar un plan de estudio
app.delete('/planesestudio/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM PlanEstudio WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Plan de estudio eliminado correctamente');
    });
});

// Crear un nuevo alumno
app.post('/alumnos', (request, response) => {
    const { numeroControl, nombre, carrera } = request.body;
    pool.query('INSERT INTO Alumno (NumeroControl, Nombre, Carrera) VALUES (?, ?, ?)', [numeroControl, nombre, carrera], (error, result) => {
        if (error) throw error;
        response.send('Alumno creado correctamente');
    });
});

// Actualizar un alumno existente
app.put('/alumnos/:numerocontrol', (request, response) => {
    const numerocontrol = request.params.numerocontrol;
    const { nombre, carrera } = request.body;
    pool.query('UPDATE Alumno SET Nombre = ?, Carrera = ? WHERE NumeroControl = ?', [nombre, carrera, numerocontrol], (error, result) => {
        if (error) throw error;
        response.send('Alumno actualizado correctamente');
    });
});

// Eliminar un alumno
app.delete('/alumnos/:numerocontrol', (request, response) => {
    const numerocontrol = request.params.numerocontrol;
    pool.query('DELETE FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
        if (error) throw error;
        response.send('Alumno eliminado correctamente');
    });
});

// Crear un nuevo grupo
app.post('/grupos', (request, response) => {
    const { nombre, capacidad } = request.body;
    pool.query('INSERT INTO Grupo (Nombre, Capacidad) VALUES (?, ?)', [nombre, capacidad], (error, result) => {
        if (error) throw error;
        response.send('Grupo creado correctamente');
    });
});

// Actualizar un grupo existente
app.put('/grupos/:id', (request, response) => {
    const id = request.params.id;
    const { nombre, capacidad } = request.body;
    pool.query('UPDATE Grupo SET Nombre = ?, Capacidad = ? WHERE id = ?', [nombre, capacidad, id], (error, result) => {
        if (error) throw error;
        response.send('Grupo actualizado correctamente');
    });
});

// Eliminar un grupo
app.delete('/grupos/:id', (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM Grupo WHERE id = ?', id, (error, result) => {
        if (error) throw error;
        response.send('Grupo eliminado correctamente');
    });
});

// Obtener todas las asistencias
app.get('/asistencias', (req, res) => {
    pool.query('SELECT * FROM Asistencia', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results);
    });
});

// Obtener una asistencia por su ID
app.get('/asistencias/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM Asistencia WHERE id = ?', id, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results);
    });
});

// Crear una nueva asistencia
app.post('/asistencias', (req, res) => {
    const { AlumnoID, Fecha, Presente } = req.body;
    pool.query('INSERT INTO Asistencia (AlumnoID, Fecha, Presente) VALUES (?, ?, ?)', [AlumnoID, Fecha, Presente], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Asistencia añadida con ID: ${results.insertId}`);
    });
});

// Actualizar una asistencia
app.put('/asistencias/:id', (req, res) => {
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
app.delete('/asistencias/:id', (req, res) => {
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
    app.get('/profesores', (req, res) => {
        pool.query('SELECT * FROM Profesores', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener profesores' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los departamentos
    app.get('/departamentos', (req, res) => {
        pool.query('SELECT * FROM Departamento', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener departamentos' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todas las materias
    app.get('/materias', (req, res) => {
        pool.query('SELECT * FROM Materia', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener materias' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los planes de estudio
    app.get('/planesestudio', (req, res) => {
        pool.query('SELECT * FROM PlanEstudio', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener planes de estudio' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los alumnos
    app.get('/alumnos', (req, res) => {
        pool.query('SELECT * FROM Alumno', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener alumnos' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todos los grupos
    app.get('/grupos', (req, res) => {
        pool.query('SELECT * FROM Grupo', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener grupos' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para obtener todas las asistencias
    app.get('/asistencias', (req, res) => {
        pool.query('SELECT * FROM Asistencia', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error al obtener asistencias' });
            }
            res.status(200).json(results);
        });
    });
    // Obtener un profesor por su RFC
    app.get('/profesores/:rfc', (req, res) => {
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
    app.get('/departamentos/:id', (req, res) => {
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
    app.get('/materias/:clave', (req, res) => {
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
    app.get('/planesestudio/:id', (req, res) => {
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
    app.get('/alumnos/:numerocontrol', (req, res) => {
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
    app.get('/grupos/:id', (req, res) => {
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
    app.get('/asistencias/:id', (req, res) => {
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
};

module.exports = router;