const mongoose = require('mongoose');
const {recipesSchema} = require('./recipes');

const mealPlanSchema = mongoose.Schema({
  name: {type: String},
  recipeNames: [{recipesSchema}], 
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
