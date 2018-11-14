// Requies
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoute = require('./routes/usuario');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', {
        useCreateIndex: true,
        useNewUrlParser: true
    },
    (err, res) => {
        if (err) {
            throw err;
        }

        console.log("Base de datos: online");
    });

// Rutas
app.use('/usuario', usuarioRoute);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3001, () => {
    console.log("Express server purto 3001 online");
});