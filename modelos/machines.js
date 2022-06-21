const mongoose = require("mongoose");


let macSchema = new mongoose.Schema({
	ma_segmid: {type: String},
	store_id: {type: String}, 
	webusername: {type: String},
})

module.exports = mongoose.model('Machines', macSchema)