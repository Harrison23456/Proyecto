const mongoose = require("mongoose");


let salSchema = new mongoose.Schema({
	nombre: {type: String},
	user: {type: String},
	host: {type: String}, 
	database: {type: String},
	password: {type: String},
	port: {type: Number},
})

module.exports = mongoose.model('Salas', salSchema)