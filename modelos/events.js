const mongoose = require("mongoose");


let evSchema = new mongoose.Schema({
	segmid: {type: String},
	eventtime: {type: String}, 
	eventcode: {type: String},
	eventname: {type: String},
})

module.exports = mongoose.model('Eventos', evSchema)