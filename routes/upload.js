const express = require('express');
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');
const app = express();

const Libros = require('../models/libro');

app.use(fileUpload());

app.put('/upload/:ruta/:id', (req, res) => {
    let id = req.params.id;
    let ruta = req.params.ruta;
    let archivo = req.files.archivo;

    let nombre = uniqid() + path.extname(archivo.name);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado nigun archivo'
        });

    }

    let validExtensions = ['image/jpg', 'image/gif', 'image/jpeg', 'image/png'];

    if (!validExtensions.includes(archivo.mimetype)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Solo las extensiones <jpg, gif, jpeg, png> son validas suba otro archivo'
        });
    }

    archivo.mv(`uploads/${ruta}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: `ocurrio un error en el servidor al tratar de subir una imagen: ${err}`
            })
        }
    });

    switch (ruta) {
        case 'libro':
            imagenLibro(id, res, nombre);
            break;
        default:
            console.log('ruta no valida');
            break;
    }
});


function imagenLibro(id, res, nombreImagen) {
    Libros.findById(id, (err, Lib) => {
        if (err) {
            borrarArchivo(nombreImagen, 'libros');
            return res.status(400).json({
                ok: false,
                mensaje: `ocurrio un error al momento de subir la imagen: ${err}`
            });
        }

        if (!Lib) {
            borrarArchivo(nombreImagen, 'libros');
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe ese producto'
            });
        }

        PR.img = nombreImagen;
        PR.save((err, libroDB) => {
            if (err) {
                borrarArchivo(nombreImagen, 'libros');
                return res.status(500).json({
                    ok: false,
                    mensaje: `Ocurrio un error al momento de relacionar el archivo con el regsitro ${err}`
                });
            }
            return res.json({
                ok: true,
                mensaje: `la imagen se ha subido con exito`,
                Libros: libroDB
            });
        });
    });
}

function borrarArchivo(nombreImagen, ruta) {
    //Dirname nos regresera un string y nos da la ruta de la imagen
    let pathImg = path.resolve(__dirname, `../../uploads/${ruta}/${nombreImagen}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }

    console.log('imagen borrada');
}


module.exports = app;