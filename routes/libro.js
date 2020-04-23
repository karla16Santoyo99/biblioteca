const express = require('express');
const app = express();
const _ = require('underscore');
const Libros = require('../models/libro');

app.get('/libro', function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;

    Libros.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, libro) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ocurrio un error al consular tus libros'
                });
            }
            res.json({
                ok: true,
                mensaje: 'consulta realizada con exito',
                libro
            });

        });
});

app.post('/libro', function(req, res) {
    let body = req.body;
    console.log(body);
    let libro = new Libros({
        titulo: body.titulo,
        descripcion: body.descripcion,
        paginas: body.paginas,
        autor: body.autor
    });
    libro.save((err, libroDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `hubo un erro al momento de agregar ek libro ${err}`
            });
        }
        res.json({
            ok: true,
            mensaje: 'el libro se agrego correctamente ',
            libroDB
        });
    });
});
app.put('/libro/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['titulo', 'descripcion', 'paginas', 'autor']);

    Libros.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, librosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de actualizar ${err}`
            });
        }
        return res.json({
            ok: true,
            mensaje: 'Cambios guardados con exito',
            libro: librosDB
        });
    });
});

app.delete('/libro/:id', function(req, res) {
    let id = req.params.id;

    Productos.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Ocurrio un error al momento de eliminar el libro intente de nuevo ${err}`
            });
        }
        return res.json({
            ok: true,
            mensaje: 'El libro ya no se encuentra en el inventario',
            resp
        });
    });
});

module.exports = app;