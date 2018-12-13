const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
	username: String,
	bcryptPassword: String,
	name: String,
	recipes: [mongoose.Schema.Types.ObjectId],
	likes: [mongoose.Schema.Types.ObjectId],
	follows: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model('Chef', ChefSchema)