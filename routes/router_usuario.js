var express = require('express');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../modelos/user');
const Salas = require('../modelos/salas');
const Eventos = require('../modelos/events');
const expressLayoutes = require('express-ejs-layouts');
const fs = require('fs');
const dotenv = require("dotenv");
const alert = require("alert");
//const JSAlert = require("js-alert");
const jwt = require('jsonwebtoken');
const prefix = require('array-prefix')
const jwt_decode = require("jwt-decode");
const isAdmin = require('../middlewares/isAdmin')

//usuario online_user
//clave: qwerty@@
//Base de DAtos: online_db
//10.10.1.24
const { Client, Pool } = require('pg');
const url = 'mongodb+srv://Hector7832812_PPT2:we6767cwcewc9ews@cluster0.ejla6.mongodb.net/Usuarios'


const app = express.Router();

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


app.get("/usuarios/signup", isAdmin, verify, async function (req, res){
  const usersCollection = await User.find()
    .then(results => {
      res.render('usuarios/signup.ejs', { User: results })
    })
    .catch()
});

app.get("/usuarios/update/:id", verify, async function (req, res, next){

 try {
        const id = await req.params.id;
        const unusuario = await User.findById(id).exec();
        let idfinal = unusuario.id;

        res.render('usuarios/update.ejs', {
            User: unusuario
        });
        } catch (error) {
        alert('Ocurrió un error al actualizar usuario');
        res.redirect('signup');
    }
});

app.get("/usuarios/delete/:id", verify, async function (req, res, next){
     try {
        const id = req.params.id;
        const oneusuario = await User.findById(id).exec();


        res.render('usuarios/delete', {
            User: oneusuario
        });
    } catch (error) {
        alert('Ocurrió un error al eliminar usuario');
        res.redirect('signup');
    }
});

app.get("/", async function (req, res){
	 const usersCollection = await User.find()
    .then(results => {
      res.render('usuarios/login.ejs', { User: results, layout: 'layout2' })
    })
    .catch()
});


app.post('/usuarios/register', function (req, res){

//función de id generada al azar
    function generateRandomString(n) {
        let randomString           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for ( let i = 0; i < n; i++ ) {
          randomString += characters.charAt(Math.floor(Math.random()*characters.length));
       }
       return randomString;
    }

    function Letrasynumeros(str) {
      return /^[A-Za-z0-9]*$/.test(str);
    }

//acaba función
let palrandom = generateRandomString(20)
let id_nueva = `us${palrandom}`
    const {username, password, nombre, apellido, tipo, phone, usuario_user} = req.body;
    const user = new User({username, password, nombre, apellido, tipo: id_nueva, phone, usuario_user});


    user.save(err =>{
        if (err) {
            console.log(err)
            alert('Error al registrar usuario.');
            res.redirect('signup')
        } else {
            res.redirect('signup')
        }
    })
})

app.post('/authenticate', function (req, res){
    const {username, password} = req.body;
    User.findOne({username}, (err, user) =>{
        if(err){
            alert('Error al autenticar usuario.')
            res.redirect('/')
        }
        else if(!user){
            alert('El usuario no existe')
            res.redirect('/')
        }
        else{
            user.isCorrectPassword(password, (err, result)=>{
            	    let token = jwt.sign({ username: user.username, usuario_user: user.usuario_user, tipo: user.tipo }, process.env.AUTH_TOKEN_SECRET);
                	res.cookie("authentication-token", token)
                if(err){
                    alert('Error al autenticar usuario.')
                    res.redirect('/')
                }
                else if(result){                	
                    let userid = user.tipo;
                    let usernuevo = userid.slice(0, 2);
                    switch(usernuevo){
                        case 'us':
                        res.redirect('salas/salas_varias');
                        break;

                        case 'ad':
                        res.redirect('usuarios/signup')
                        break;
                    }
                }
                else{
                    alert('Usuario o contraseña incorrectos.')
                    res.redirect('/')
                }
            })
        }
    				
    })
})



app.post('/usuarios/update/:id', async function (req, res, next) {
    const id = req.params.id;
    const usuario_username = req.params.username;
    const data = req.body;

     function generateRandomString(n) {
        let randomString           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for ( let i = 0; i < n; i++ ) {
          randomString += characters.charAt(Math.floor(Math.random()*characters.length));
       }
       return randomString;
    }

    function Letrasynumeros(str) {
      return /^[A-Za-z0-9]*$/.test(str);
    }
let palrandom = generateRandomString(20)
let id_nueva = `us${palrandom}`

    let user = await User.findByIdAndUpdate(id, {
        username: data.username,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        tipo: id_nueva,
        phone: data.phone,
    }, {new: true});
    if(!user) return alert('Usuario no encontrado');

    res.redirect('/usuarios/signup');
});


app.post('/usuarios/delete/:id', async function(req, res, next) {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndRemove(id);
        if(!user) return alert('Usuario no encontrado');
        res.redirect('/usuarios/signup');        
    } catch (error) {
        alert('Ocurrió un error en el momento de eliminar el usuario.');
    }
});

app.get('/usuarios/logout', async function(req, res, next) {
    try {
        res.clearCookie('authentication-token', {path: '/'})
        res.redirect('/');        
    } catch (error) {
        console.log(error.message);
    }
});
module.exports = app;