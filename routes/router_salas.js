var express = require('express');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../modelos/salas');
const User_real = require('../modelos/user');
const expressLayoutes = require('express-ejs-layouts');
const fs = require('fs');
const dotenv = require("dotenv");

const { Client, Pool } = require('pg');
const jwt = require('jsonwebtoken');
const prefix = require('array-prefix')
const jwt_decode = require("jwt-decode");
var app = express.Router();
const alert = require("alert");

const url = 'mongodb+srv://Hector7832812_PPT2:we6767cwcewc9ews@cluster0.ejla6.mongodb.net/Usuarios'
mongoose.connect(url,{
    maxPoolSize: 2,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 3000,
    socketTimeoutMS: 30000,
    keepAlive: true,
}).then(console.log('Conectado a MongoDB'))

dotenv.config({ path: "./config/config.env" });
const verify = require("./verifyToken");


/*------------------------MÉTODOS GET-----------------------------*/

app.get("/salas/salas_mant", verify, async function (req, res){
  const usersCollection = await User.find()
    .then(results => {
      res.render('salas/salas_mant.ejs', { User: results })
    })
    .catch()
});


app.get("/salas/salas_update/:id", verify, async function (req, res, next){

 try {
        const id = await req.params.id;
        const unusuario = await User.findById(id).exec();
        let idfinal = unusuario.id;

        res.render('salas/salas_update.ejs', {
            User: unusuario
        });
        } catch (error) {
        alert('Error al actualizar salas');
    }
});

app.get("/salas/salas_delete/:id", verify, async function (req, res, next){
     try {
        const id = req.params.id;
        const oneusuario = await User.findById(id).exec();


        res.render('salas/salas_delete', {
            User: oneusuario
        });
    } catch (error) {
        alert('Error al eliminar sala');
    }
});


app.get("/salas/salas_varias", verify, async function (req, res, next){
  const usersCollection = await User.find()
  const usuariosreales = await User_real.find()

    let arraytoken = req.rawHeaders;
    let tokenminiprev = prefix('authentic', arraytoken);
    let tokenmini = tokenminiprev[0];
    let token = `${tokenmini.slice(21)}`;
    let decoded = jwt_decode(tokenmini);

  res.render('salas/salas_varias.ejs', { User: usersCollection, 
    Usuariosreales: usuariosreales, 
    Cookies: decoded.usuario_user, layout: 'layout3'})
});




app.get("/salas/salas_varias_admin", verify, async function (req, res, next){
  const usersCollection = await User.find()
  res.render('salas/salas_varias_admin.ejs', { User: usersCollection})
});


/*------------------------MÉTODOS POST-----------------------------*/


app.post('/salas/register_sala', verify, async function (req, res){
    const {nombre, user, host, database, password, port} = req.body;
    const req1 = await User.findOne({user: user});
    if(!req1)
    {
        const salitas = new User({nombre, user, host, database, password, port});

        salitas.save(err =>{
            if (err) {
                return alert('Error al registrar sala.');
                res.redirect('/salas/salas_mant')
            } else {
                res.redirect('/salas/salas_mant')
            }
        })
    }
    if(req1)
    {
        return res.send('Esta sala ya está registrada.')
    }
})


app.post('/salas/salas_update/:id', verify, async function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    let user = await User.findByIdAndUpdate(id, {
        nombre: data.nombre,
        user: data.user,
        host: data.host,
        database: data.database,
        password: data.password,
        port: data.port,
    }, {new: true});
    if(!user) return alert('Sala no encontrada');

    res.redirect('/salas/salas_mant');
});


app.post('/salas/salas_delete/:id', verify, async function(req, res, next) {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndRemove(id);
        if(!user) return alert('Sala no encontrada');
        res.redirect('/salas/salas_mant');        
    } catch (error) {
        return alert('Error al eliminar sala');
    }
});


app.get("/salas/listarevs/:id", verify, async function (req, res){

        const id = req.params.id;
        const onesala = await User.findById(id);

const sala = await User.find();
async function recarga () {

/*Conexión a PostgreSQL*/
const client = new Pool({

    user: `${onesala.user}`,
    host: `${onesala.host}`,
    database: `${onesala.database}`,
    password: `${onesala.password}`,
    port: 5432,
});

//Pooling

const pool = new Pool({

    user: `${onesala.user}`,
    host: `${onesala.host}`,
    database: `${onesala.database}`,
    password: `${onesala.password}`,
    port: 5432,
});

/*Manejo de errores de pooling*/
pool.on('error', (err, client) => {
    console.error('Error:', err);
});

 pool.connect((err, client, done) => {
    if(err) throw err;

    const primer_sql = `select machines.segmid from machines where store_id= 1`

    client.query(primer_sql, async(error, results)=>{
        done();
            let resultados = await results.rows
            let texto1 = ``

   
for(var i = 0; i < resultados.length; i++) {
  texto1 += `(select eventtime, eventname, eventmeter.segmid, eventcode 
    from eventmeter 
    where eventmeter.segmid in ('${resultados[i].segmid}') order by eventtime desc limit 1)` + `union`;
}

let textfinal = texto1.slice(0, texto1.length-5);
let sql = `(${textfinal} )order by eventtime desc`

    client.query(sql, async (error, results) => {
        if (error) {
            throw error;
        }

        res.render("salas/listarevs.ejs", {req: results.rows, layout: 'layout3'})


        })
      })

 });

    }
    setTimeout( recarga, 5000); 
});

module.exports = app;