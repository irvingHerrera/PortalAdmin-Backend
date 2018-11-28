// Requies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables
var app = express();

// bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicoRoute = require('./routes/medico');

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
app.use('/login', loginRoute);
app.use('/hospital', hospitalRoute);
app.use('/medico', medicoRoute);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3001, () => {
    console.log("Express server purto 3001 online");
});