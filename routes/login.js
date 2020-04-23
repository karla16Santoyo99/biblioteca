const express = require('express');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Usuario y/o Contraseña incorrectos ${err}`
            });
        }
        if (!usrDB) {
            return res.status(400).json({
                ok: false,
                mensaje: `*Usuario y/o Contraseña incorrectos ${err}`
            });
        }
        if (!bycrypt.compareSync(body.password, usrDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: `Usuario y/o *Contraseña incorrectos ${err}`
            });
        }
        let token = jwt.sign({ usuario: usrDB }, process.env.FIRMA);

        return res.json({
            ok: true,
            mensaje: `Bienvenido ${usrDB.nombre}`,
            usuario: usrDB,
            token
        });
    });
});

module.exports = app;