var express = require('express');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Medico = require('../models/medico');

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        medico: 'test medico'
    });
});


module.exports = app;