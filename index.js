let express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
let Routes_Usuarios = require('./routes/router_usuario');
let Routes_Salas = require('./routes/router_salas');
let Router_extras = require('./routes/router_extras');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./modelos/user')
const Eventos = require('./modelos/events')
const expressLayoutes = require('express-ejs-layouts');
const fs = require('fs');

const { Client, Pool } = require('pg');

/*aaañadir segmid, egmid, tipo de máquina, model y un botón de importar*/
let app = express();
app.set('view engine', 'ejs')

app.use(expressLayoutes);
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(flash());
app.use('/', Routes_Usuarios);
app.use('/', Routes_Salas);
app.use('/', Router_extras);

const PORT = process.env.PORT || 3000;



app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto 3000`))

