const { response, request } = require('express');
const pool = require('../data/Conexion');
const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: '¡Bienvenido a la API REST de Node.js Express!'
        });
    });

    // Endpoints para la tabla Maestros
    app.get('/maestros', (request, response) => {
        pool.query('SELECT * FROM Maestros', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    app.get('/maestros/:rfc', (request, response) => {
        const rfc = request.params.rfc;
        pool.query('SELECT * FROM Maestros WHERE rfc = ?', rfc, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Alumnos
    app.get('/alumnos', (request, response) => {
        pool.query('SELECT * FROM Alumnos', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    app.get('/alumnos/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Alumnos WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla Materias
    app.get('/materias', (request, response) => {
        pool.query('SELECT * FROM Materias', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    app.get('/materias/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Materias WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la relación entre Maestros y Materias
    app.get('/maestros/:rfc/materias', (request, response) => {
        const rfc = request.params.rfc;
        pool.query('SELECT * FROM Maestros_Materias WHERE maestro_rfc = ?', rfc, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la relación entre Alumnos y Materias
    app.get('/alumnos/:id/materias', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Alumnos_Materias WHERE alumno_id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla de asistencias
    app.get('/asistencias', (request, response) => {
        pool.query('SELECT * FROM Asistencias', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    app.get('/asistencias/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Asistencias WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para la tabla de entrada y salida de maestros
    app.get('/entrada_salida_maestros', (request, response) => {
        pool.query('SELECT * FROM Entrada_Salida_Maestros', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    app.get('/entrada_salida_maestros/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Entrada_Salida_Maestros WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Endpoints para agregar nuevos registros

    // Agregar nuevo maestro
    app.post('/maestros', (request, response) => {
        pool.query('INSERT INTO Maestros SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Maestro añadido con RFC: ${result.insertId}`);
        });
    });

    // Agregar nuevo alumno
    app.post('/alumnos', (request, response) => {
        pool.query('INSERT INTO Alumnos SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Alumno añadido con ID: ${result.insertId}`);
        });
    });

    // Agregar nueva materia
    app.post('/materias', (request, response) => {
        pool.query('INSERT INTO Materias SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Materia añadida con ID: ${result.insertId}`);
        });
    });

    // Agregar relación entre maestro y materia
    app.post('/maestros_materias', (request, response) => {
        pool.query('INSERT INTO Maestros_Materias SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Relación maestro-materia añadida.`);
        });
    });

    // Agregar relación entre alumno y materia
    app.post('/alumnos_materias', (request, response) => {
        pool.query('INSERT INTO Alumnos_Materias SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Relación alumno-materia añadida.`);
        });
    });

    // Agregar nueva asistencia
    app.post('/asistencias', (request, response) => {
        pool.query('INSERT INTO Asistencias SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Asistencia añadida con ID: ${result.insertId}`);
        });
    });

    // Agregar registro de entrada y salida de maestro
    app.post('/entrada_salida_maestros', (request, response) => {
        pool.query('INSERT INTO Entrada_Salida_Maestros SET ?', request.body, (error, result) => {
            if (error) throw error;
            response.status(201).send(`Registro de entrada y salida de maestro añadido con ID: ${result.insertId}`);
        });
    });

    return app;
};

module.exports = router;