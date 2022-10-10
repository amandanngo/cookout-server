const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    postedOn: Date,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    servings: Number,
    ingredients: [{
        type: String
    }],
    directions: String,
    pictureUrl: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;