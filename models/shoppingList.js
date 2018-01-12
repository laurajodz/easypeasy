const mongoose = require('mongoose');
const {Recipes} = require('./recipes');

const shoppingListSchema = new mongoose.Schema({
  name: {type: String, required: true},  // ex. Week of January 1, 2018
  itemNames: [Recipes], // ex. [1 pound chicken, 2 tbsp Mayonnaise, 1/4 cup almonds]
  recipeName: [Recipes] // ex. Chicken Salad
});

const shoppingList = mongoose.model('shoppingList', shoppingListSchema);

module.exports = {shoppingList};
