const mongoose = require('mongoose');

const recipesSchema = mongoose.Schema({
  name: {type: String},
  image: {type: String},
  ingredients: [String], // an array of ingredients
  url: {type: String},
  source: {type: String}
});

const Recipes = mongoose.model('Recipes', recipesSchema);

module.exports = {Recipes};
