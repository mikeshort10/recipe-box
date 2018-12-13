const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
        name: String,
        ingredients: [{
            name: String,
            amount: Number,
            measurement: String,
            display: Boolean,
        }],
        directions: [String],
        chef: mongoose.Schema.Types.ObjectId
    }

)

module.exports = mongoose.model('Recipe', RecipeSchema);