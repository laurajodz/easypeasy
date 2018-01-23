const mongoose = require('mongoose');

const recipesSchema = mongoose.Schema({
  name: {type: String},
  image: {type: String},
  ingredients: [
    {type: String}
  ],
  url: {type: String},
  source: {type: String}
});

const Recipes = mongoose.model('recipes', recipesSchema);

module.exports = {Recipes, recipesSchema};
