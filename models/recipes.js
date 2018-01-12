const mongoose = require('mongoose');

const recipesSchema = mongoose.Schema({
  name: {type: String},
  image: {type: String},
  ingredients: [      // an array of ingredient items
    {type: String}
  ],
  url: {type: String},
  source: {type: String}
});

const Recipes = mongoose.model('Recipes', recipesSchema);

module.exports = {Recipes, recipesSchema};
