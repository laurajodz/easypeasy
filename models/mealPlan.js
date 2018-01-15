const mongoose = require('mongoose');
const {recipesSchema} = require('./recipes');

const mealPlanSchema = mongoose.Schema({
  name: {type: String, required: true}, // ex. Week of January 1, 2018
  recipeNames: [recipesSchema], // ex. Chicken Salad, Pot Roast, Vegetarian Chilli
  additionalItemNames: [{type: String}]
});

const MealPlan = mongoose.model('mealPlan', mealPlanSchema);

module.exports = {MealPlan};
