const mongoose = require('mongoose');
const {recipesSchema} = require('./recipes');

const mealPlanSchema = mongoose.Schema({
  name: {type: String}, // ex. Week of January 1, 2018
  recipeNames: [{recipesSchema}], // ex. Chicken Salad, Pot Roast, Vegetarian Chilli
  additionalItemNames: [{type: String}]
});

// mealPlanSchema.methods.serialize = function() {
//
//   return {
//     id: this._id,
//     name: this.name,
//     recipesNames: this.recipeNames,
//     additionalItemNames: this.additionalItemNames
//   };
// }

const MealPlan = mongoose.model('mealPlan', mealPlanSchema);

module.exports = {MealPlan};
