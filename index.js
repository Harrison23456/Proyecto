let express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views')));

/*Conexión a MongoDB*/

const url = 'mongodb+srv://Hector7832812_PPT2:we6767cwcewc9ews@cluster0.ejla6.mongodb.net/Usuarios'
//usuario online_user
//clave: qwerty@@
//Base de DAtos: online_db
mongoose.connect(url,{
    maxPoolSize: 2,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 3000,
    socketTimeoutMS: 30000,
    keepAlive: true,
}).then(console.log('Conectado a MongoDB'))




app.get("/signup", async (req, res)=>{
  const usersCollection = await User.find()
    .then(results => {
      res.render('signup.ejs', { User: results })
    })
    .catch()

});

app.get("/update/:id", async (req, res, next)=>{
 try {

        const id = await req.params.id;
        console.log(req.params)
        const unusuario = await User.findById(id).exec();
        console.log(unusuario)
        res.render('update.ejs', {
            User: unusuario
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/delete/:id", async (req, res, next)=>{
     try {
        const id = req.params.id;
        const oneusuario = await User.findById(id).exec();
        res.render('delete', {
            User: oneusuario
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/", async (req, res)=>{

});

app.get("/login", async (req, res)=>{
  const usersCollection = await User.find()
    .then(results => {
      res.render('login.ejs', { User: results })
    })
    .catch()

});

app.post('/register', (req, res) =>{
    const {username, password, nombre, apellido, phone} = req.body;
    const user = new User({username, password, nombre, apellido, phone});

    user.save(err =>{
        if (err) {
            req.status(500).send('Error al registrar usuario.');
        } else {
            res.redirect('signup')
        }
    })
})

app.post('/authenticate', (req, res) =>{
    const {username, password} = req.body;
    User.findOne({username}, (err, user) =>{
        if(err){
            res.status(500).send('Error al autenticar usuario.')
        }
        else if(!user){
            res.status(500).send('El usuario no existe')
        }
        else{
            user.isCorrectPassword(password, (err, result)=>{
                if(err){
                    res.status(500).send('Error al autenticar usuario.')
                }
                else if(result){
                    res.status(500).send('Usuario autenticado correctamente')
                }
                else{
                    res.status(500).send('Usuario o contraseña incorrectos.')
                }
            })
        }
    })
})

app.post('/update/:id', async(req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    let user = await User.findByIdAndUpdate(id, {
        username: data.username,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        phone: data.phone,
    }, {new: true});
    if(!user) return res.status(404).send('Usuario no encontrado');

    res.redirect('/');
});


app.post('/delete/:id',  async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndRemove(id);
        if(!user) return res.status(404).send('Usuario no encontrado');
        res.redirect('/signup');        
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/listarevs", async (req, res)=>{
    async function recarga () {
/*Conexión a PostgreSQL*/
const client = new Pool({

    user: 'online_user',
    host: '11.11.2.24',
    database: 'online_db',
    password: 'qwerty@@',
    port: 5432,
});

 client.connect().then(console.log(`Conectado a la base de datos de Postgre`), res => {
        client.release()
      });



    const sql = "select * from eventmeter  order by eventtime desc limit 1";
    
    client.query(sql, async (error, results) => {
        if (error) {
            throw error;
        }

        let id_evento = '8127381283782138712';
        let segmid = results.rows[0].segmid;
        let eventtime = results.rows[0].eventtime;
        let eventcode = results.rows[0].eventcode;
        let eventname = results.rows[0].eventname;

        let event = await Eventos.findOneAndUpdate({idnueva1: id_evento}, {
            $set:{
        segmid: segmid,
        eventtime: eventtime,
        eventcode: eventcode,
        eventname: eventname,
        }}, {new: true})  


        const req = await Eventos.findOne({idnueva1: id_evento});
        res.render("listarevs.ejs", {todoDbList: results.rows,
            req: req})
       // console.log(results.rows[0])

       
    }) 
    }
    setTimeout( recarga, 5000); // 5 seconds



});
app.listen(3000, () => console.log(`Escuchando en el puerto 3000`))

