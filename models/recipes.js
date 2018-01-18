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

// recipesSchema.methods.serialize = function() {
//
//   return {
//     id: this._id,
//     name: this.name,
//     image: this.image,
//     ingredients: this.ingredients,
//     url: this.url,
//     source: this.source
//   };
// }

const Recipes = mongoose.model('recipes', recipesSchema);

module.exports = {Recipes, recipesSchema};
