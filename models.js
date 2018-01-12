// // const uuid = require('uuid');
//
// function StorageException(message) {
//    this.message = message;
//    this.name = "StorageException";
// }
//
// const ShoppingList = {
//   create: function(name, unit, amount) {
//     console.log('Creating new shopping list item');
//     const item = {
//       name: name,
//       unit: unit,
//       amount: amount
//       // id: uuid.v4()
//     };
//     this.items[item.id] = item;
//     return item;
//   },
//   get: function() {
//     console.log('Retrieving shopping list items');
//     return Object.keys(this.items).map(key => this.items[key]);
//   },
//   delete: function(id) {
//     console.log(`Deleting shopping list item \`${id}\``);
//     delete this.items[id];
//   },
//   update: function(updatedItem) {
//     console.log(`Updating shopping list item \`${updatedItem.id}\``);
//     const {id} = updatedItem;
//     if (!(id in this.items)) {
//       throw StorageException(
//         `Can't update item \`${id}\` because doesn't exist.`)
//     }
//     this.items[updatedItem.id] = updatedItem;
//     return updatedItem;
//   }
// };
//
// function createShoppingList() {
//   const storage = Object.create(ShoppingList);
//   storage.items = {};
//   return storage;
// }
//
// const Recipes = {
//   create: function(name, url, photo, ingredients) {
//     console.log('Creating a new recipe');
//     const item = {
//       name: name,
//       url: url,
//       photo: photo,
//       ingredients: ingredients
//       // id: uuid.v4()
//     };
//     this.items[item.id] = item;
//     return item;
//   },
//   get: function() {
//     console.log('Retreiving recipes');
//     return Object.keys(this.items).map(key => this.items[key]);
//   },
//   delete: function(itemId) {
//     console.log(`Deleting recipe with id \`${itemId}\``);
//     delete this.items[itemId];
//   },
//   update: function(updatedItem) {
//     console.log(`Updating recipe with id \`${updatedItem.id}\``);
//     const {id} = updatedItem;
//     if (!(id in this.items)) {
//       throw StorageException(
//         `Can't update item \`${id}\` because doesn't exist.`)
//     }
//     this.items[updatedItem.id] = updatedItem;
//     return updatedItem;
//   }
// };
//
//
// function createRecipes() {
//   const storage = Object.create(Recipes);
//   storage.items = {};
//   return storage;
// }
//
// module.exports = {
//   ShoppingList: createShoppingList(),
//   Recipes: createRecipes()
// }
