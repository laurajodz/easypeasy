const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


// const {Recipes} = require('./models');

// we're going to add some recipes to Recipes
// so there's some data to look at
// Recipes.create(
//   'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
// Recipes.create(
//   'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);
//
// // send back JSON representation of all recipes
// on GET requests to root
router.get('/', (req, res) => {
  res.json(Recipes.get());
});


// when new recipe added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

// Delete recipes (by id)!
router.delete('/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated recipe, ensure has
// required fields. also ensure that recipe id in url path, and
// recipe id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `Recipes.updateItem` with updated recipe.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'ingredients', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  const updatedItem = Recipes.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });
  res.status(204).end();
})

module.exports = router;
