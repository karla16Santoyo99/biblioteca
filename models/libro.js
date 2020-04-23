const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let LibrosSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'es necesario el titulo del libro '],
        unique: true
    },
    descripcion: {
        type: String,
        required: [true, 'es necesario una descripcion del libro']

    },
    paginas: {
        type: Number,
        require: true

    },
    autor: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    }

});
LibrosSchema.plugin(uniqueValidator, {
    mensaje: '{PATH} Debe ser unico'
});
module.exports = mongoose.model('Libros', LibrosSchema);