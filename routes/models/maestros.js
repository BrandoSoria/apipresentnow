const pool = require('../conexion');


const router = (app) => {

    // Check if the request body has the necessary properties
    const validateRequestBody = (request, propertyNames) => {
        for (const propertyName of propertyNames) {
            if (!request.body.hasOwnProperty(propertyName)) {
                return false;
            }
        }
        return true;
    };

    // Check if the request parameters has the necessary properties
    const validateRequestParams = (request, propertyNames) => {
        for (const propertyName of propertyNames) {
            if (!request.params.hasOwnProperty(propertyName)) {
                return false;
            }
        }
        return true;
    };

    // Handle errors
    const handleError = (error, response) => {
        console.error(error);
        return response.status(500).json({ error: 'Error interno del servidor' });
    };

    // Handle query results
    const handleQueryResults = (error, results, response) => {
        if (error) {
            return handleError(error, response);
        }
        response.status(200).json(results);
    };

    // Ruta para obtener todos los profesores
    app.get('/profesores', (req, res) => {
        pool.query('SELECT * FROM Profesores', handleQueryResults.bind(null, res));
    });

    // Obtener un profesor por su RFC
    app.get('/profesores/:rfc', (req, res) => {
        const rfc = req.params.rfc;
        pool.query('SELECT * FROM Profesores WHERE RFC = ?', [rfc], (error, results) => {
            if (error) {
                return handleError(error, res);
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Profesor no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Actualizar un profesor existente
    app.put('/profesores/:rfc', (req, res) => {
        if (!validateRequestBody(req, ['nombre', 'departamento'])) {
            return res.status(400).json({ error: 'Faltan propiedades en el cuerpo de la solicitud' });
        }
        const rfc = req.params.rfc;
        const { nombre, departamento } = req.body;
        pool.query('UPDATE Profesores SET Nombre = ?, Departamento = ? WHERE RFC = ?', [nombre, departamento, rfc], handleQueryResults.bind(null, res));
    });

    // Eliminar un profesor
    app.delete('/profesores/:rfc', (req, res) => {
        const rfc = req.params.rfc;
        pool.query('DELETE FROM Profesores WHERE RFC = ?', [rfc], handleQueryResults.bind(null, res));
    });

    // Entrada de profesor
    app.post('/entrada/profesor', (req, res) => {
        if (!validateRequestBody(req, ['profesorRfc', 'entro'])) {
            return res.status(400).json({ error: 'Faltan propiedades en el cuerpo de la solicitud' });
        }
        const { profesorRfc, entro } = req.body;
        const fechaHora = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        pool.query('INSERT INTO EntradaMaestro (ProfesorRFC, FechaHora, Entro) VALUES (?, ?, ?)', [profesorRfc, fechaHora, entro], handleQueryResults.bind(null, res));
    });

    // Obtener todas las asistencias
    app.get('/entrada/profesor', (req, res) => {
        pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro', (error, results) => {
            if (error) {
                return handleError(error, res);
            }
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(200).json(formattedDates);
        });
    });

    // Obtener asistencia por RFC
    app.get('/entrada/profesor/:rfc', (req, res) => {
        if (!validateRequestParams(req, ['rfc'])) {
            return res.status(400).json({ error: 'Faltan propiedades en la solicitud' });
        }
        const rfc = req.params.rfc;
        pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM EntradaMaestro WHERE ProfesorRFC = ?', [rfc], (error, results) => {
            if (error) {
                return handleError(error, res);
            }
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(200).json(formattedDates);
        });
    });

    // Salida de profesor
    app.post('/salida/profesor', (req, res) => {
        if (!validateRequestBody(req, ['profesorRfc', 'salida'])) {
            return res.status(400).json({ error: 'Faltan propiedades en el cuerpo de la solicitud' });
        }
        const { profesorRfc, salida } = req.body;
        const fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        pool.query('INSERT INTO SalidaMaestro (ProfesorRFC, FechaHora, Salio) VALUES (?, ?, ?)', [profesorRfc, fecha, salida], handleQueryResults.bind(null, res));
    });

    // Obtener todas las salidas
    app.get('/salida/profesor', (req, res) => {
        pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro', (error, results) => {
            if (error) {
                return handleError(error, res);
            }
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(200).json(formattedDates);
        });
    });

    // Obtener salida por RFC
    app.get('/salida/profesor/:rfc', (req, res) => {
        if (!validateRequestParams(req, ['rfc'])) {
            return res.status(400).json({ error: 'Faltan propiedades en la solicitud' });
        }
        const rfc = req.params.rfc;
        pool.query('SELECT *, DATE_FORMAT(FechaHora, "%Y-%m-%d %H:%i:%s") AS fechaConHora FROM SalidaMaestro WHERE ProfesorRFC = ?', [rfc], (error, results) => {
            if (error) {
                return handleError(error, res);
            }
            const formattedDates = results.map(result => {
                const fechaConHora = moment.tz(result.fechaConHora, 'America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                return { ...result, fechaConHora };
            });
            res.status(202).json(formattedDates);
        });
    });
}



module.exports = router;