require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/usuario'));
app.use(require('./routes/libro'));
app.use(require('./routes/prestamo'));
app.use(require('./routes/login'));
app.use(require('./routes/upload'));
mongoose.connect('mongodb+srv://Admin1:karlajudith@cluster0-azowl.mongodb.net/biblioteca?retryWrites=true&w=majority', (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000');
});