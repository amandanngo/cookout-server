const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe.model')
const User = require('../models/User.model')


router.post('/recipes',(req,res,next) => {

    const {title,description,servings,ingredients,directions,pictureUrl} = req.body;

    const {_id} = req.payload;

    Recipe.create({
        title,
        postedOn: new Date(),
        creator: _id,
        description,
        servings,
        ingredients,
        directions,
        pictureUrl
    })
        .then(newRecipe => {
            res.json({
                message: 'POST /new-recipe worked',
                recipe: newRecipe
            })

            return User.findByIdAndUpdate(_id, {
                $push: {recipes: newRecipe._id}
            },{
                new: true
            });
        })
        .then(updatedUser => {
            console.log('updated user recipes')
        })
        .catch(err => res.json(err))
})

//User's recipes
router.get('/recipes', (req,res,next) => {
    const {_id} = req.payload;

    User.findById(_id)
        .populate('recipes')
        .then(foundUser =>{
            return foundUser.recipes;
        })
        .then(userRecipes => {
            res.json({recipes: userRecipes})
        })
        .then(err => res.json(err))
})

//All users recipes
router.get('/recipes-feed', (req,res,next) => {
    Recipe.find()
        .populate('creator')
        .then(foundRecipes => {
            res.json({
                message: "GET /recipes-feed worked",
                recipes: foundRecipes
            })
        })
        .catch(err => res.json(err))
})

router.put('/recipes/:recipeId', (req,res,next) => {
    const {recipeId} = req.params;

    Recipe.findByIdAndUpdate(recipeId, req.body, {new: true})
        .then(updatedRecipe => {
            res.json({
                message: "PUT /recipes worked",
                recipe: updatedRecipe
            })
        })
        .catch(err => res.json(err))
})

router.delete('/recipes/:recipeId', (req,res,next) => {
    const {recipeId} = req.params;

    const {_id} = req.payload;

    async function deleteRecipe(){
        const foundUser = await User.findById(_id);

        const filteredRecipes = foundUser.recipes.filter(element => {
            return !element._id.equals(recipeId)
        })

        const updatedUser = await User.findByIdAndUpdate(_id, {recipes: filteredRecipes}, {new:true});

        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
            res.json({user: updatedUser, recipe: deletedRecipe})
    }

    deleteRecipe();
})

module.exports = router;
