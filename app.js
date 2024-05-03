//requiere packages and set the port
const express = require('express');
const port = 3002;
//para permitir manejo de post y put
const bodyParser = require ('body-parser');
const routes = require('./routes/routes');
const app = express();
 //usar node.js body parsing middleware
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded ({
    extended: true

 }));
 routes(app);

 
 //iniciar
 const server = app.listen(port,(error)=>{
    if (error) return console.log('error: ${error}');
    console.log('el servidor escucha en el puerto ${server.address).port}')});
