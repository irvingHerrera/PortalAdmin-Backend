// Requies
var express = require('express');

// inicializar variables
var app = express();

// Escuchar peticiones
app.listen(3001, () => {
    console.log("Express server purto 3001 online");
});