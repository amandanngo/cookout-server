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
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;