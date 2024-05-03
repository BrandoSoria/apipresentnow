const { response, request } = require('express');
const pool = require('../data/config');
const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: '¡Bienvenido a la API REST de Node.js Express!'
        });
    });

    // Endpoints para la tabla Profesores
    app.get('/profesores', (request, response) => {
        pool.query('SELECT * FROM Profesores', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Crear un nuevo profesor
app.post('/profesores', (request, response) => {
    const { nombre, rfc, departamento } = request.body;
    pool.query('INSERT INTO Profesores (Nombre, RFC, Departamento) VALUES (?, ?, ?)', [nombre, rfc, departamento], (error, result) => {
        if (error) throw error;
        response.send('Profesor creado correctamente');
    });
});

// Actualizar un profesor existente
app.put('/profesores/:rfc', (request, response) => {
    const rfc = request.params.rfc;
    const { nombre, departamento } = request.body;
    pool.query('UPDATE Profesores SET Nombre = ?, Departamento = ? WHERE RFC = ?', [nombre, departamento, rfc], (error, result) => {
        if (error) throw error;
        response.send('Profesor actualizado correctamente');
    });
});

// Eliminar un profesor
app.delete('/profesores/:rfc', (request, response) => {
    const rfc = request.params.rfc;
    pool.query('DELETE FROM Profesores WHERE RFC = ?', rfc, (error, result) => {
        if (error) throw error;
        response.send('Profesor eliminado correctamente');
    });
});

    app.get('/profesores/:rfc', (request, response) => {
        const rfc = request.params.rfc;
        pool.query('SELECT * FROM Profesores WHERE RFC = ?', rfc, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Departamento
    app.get('/departamentos', (request, response) => {
        pool.query('SELECT * FROM Departamento', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

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

    app.get('/departamentos/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Departamento WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Materia
    app.get('/materias', (request, response) => {
        pool.query('SELECT * FROM Materia', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Crear una nueva materia
app.post('/materias', (request, response) => {
    const { claveMateria, nombre, creditos } = request.body;
    pool.query('INSERT INTO Materia (ClaveMateria, Nombre, Creditos) VALUES (?, ?, ?)', [claveMateria, nombre, creditos], (error, result) => {
        if (error) throw error;
        response.send('Materia creada correctamente');
    });
});

// Actualizar una materia existente
app.put('/materias/:clave', (request, response) => {
    const clave = request.params.clave;
    const { nombre, creditos } = request.body;
    pool.query('UPDATE Materia SET Nombre = ?, Creditos = ? WHERE ClaveMateria = ?', [nombre, creditos, clave], (error, result) => {
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

    app.get('/materias/:clave', (request, response) => {
        const clave = request.params.clave;
        pool.query('SELECT * FROM Materia WHERE ClaveMateria = ?', clave, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Plan de Estudio
    app.get('/planesestudio', (request, response) => {
        pool.query('SELECT * FROM PlanEstudio', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });
    // Crear un nuevo plan de estudio
app.post('/planesestudio', (request, response) => {
    const { nombre } = request.body;
    pool.query('INSERT INTO PlanEstudio (Nombre) VALUES (?)', [nombre], (error, result) => {
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


    app.get('/planesestudio/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM PlanEstudio WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Alumno
    app.get('/alumnos', (request, response) => {
        pool.query('SELECT * FROM Alumno', (error, result) => {
            if (error) throw error;
            response.send(result);
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

    app.get('/alumnos/:numerocontrol', (request, response) => {
        const numerocontrol = request.params.numerocontrol;
        pool.query('SELECT * FROM Alumno WHERE NumeroControl = ?', numerocontrol, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Grupo
    app.get('/grupos', (request, response) => {
        pool.query('SELECT * FROM Grupo', (error, result) => {
            if (error) throw error;
            response.send(result);
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


    app.get('/grupos/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Grupo WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    return app;
};
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
module.exports = router;
