var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require ('body-parser');
const Alumno = require('./routes/routes');// Exporte desde Modulos

var app = express();

//usar node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({
   extended: true

}));
routes(app);
 //iniciar
 const server = app.listen(port,(error)=>{
    if (error) return console.log('error: ${error}');
    console.log('el servidor escucha en el puerto ${server.addres().port}');
 });