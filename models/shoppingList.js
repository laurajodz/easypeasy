const mongoose = require('mongoose');
const {mealPlan} = require('./mealPlan');

const shoppingListSchema = new mongoose.Schema({
  // name: {type: String, required: true},  // ex. Week of January 1, 2018
  itemNames: [{type: String}], // ex. [1 pound chicken, 2 tbsp Mayonnaise, 1/4 cup almonds]
  mealPlan: {type: mongoose.Schema.Types.ObjectId, ref:"mealPlan"}, // ex. Chicken Salad
  additionalItemNames: [{type: String}]
});

// const shoppingListSchema = new mongoose.Schema({
//   itemNames: [{
//     name: {
//       type: String
//     },
//     checked : {
//       type: Boolean
//     }
//   }],
//   mealPlan: {type: mongoose.Schema.Types.ObjectId, ref:"mealPlan"},
//   additionalItemNames: [{
//     name: {
//       type: String
//     },
//     checked : {
//       type: Boolean
//     }
//   }]
// });

const ShoppingList = mongoose.model('shoppingList', shoppingListSchema);

module.exports = {ShoppingList};
