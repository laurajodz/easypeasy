const mongoose = require('mongoose');
const {mealPlan} = require('./mealPlan');

const shoppingListSchema = new mongoose.Schema({
  itemNames: [{type: String}],
  mealPlan: {type: mongoose.Schema.Types.ObjectId, ref:"mealPlan"},
  additionalItemNames: [{type: String}]
},{
  usePushEach: true
});

const ShoppingList = mongoose.model('shoppingList', shoppingListSchema);

module.exports = {ShoppingList};
