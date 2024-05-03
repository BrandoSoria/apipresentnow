const { response, request } = require('express');
const pool = require('../data/Conexion');
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

    app.get('/grupos/:id', (request, response) => {
        const id = request.params.id;
        pool.query('SELECT * FROM Grupo WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    return app;
};

module.exports = router;