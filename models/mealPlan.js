const mongoose = require('mongoose');
const {Recipes} = require('./recipes');

const mealPlanSchema = mongoose.Schema({
  name: {type: Date, required: true}, // ex. Week of January 1, 2018
  recipeNames: [Recipes] // ex. Chicken Salad, Pot Roast, Vegetarian Chilli
});

const mealPlan = mongoose.model('mealPlan', mealPlanSchema);

module.exports = {mealPlan};
