const mongoose = require('mongoose');
const {recipesSchema} = require('./recipes');

const mealPlanSchema = mongoose.Schema({
  name: {type: String},
  recipeNames: [{type:mongoose.Schema.Types.ObjectId, ref:'recipes'}],
  additionalItemNames: [{type: String}]
});

const MealPlan = mongoose.model('mealPlan', mealPlanSchema);

module.exports = {MealPlan};
