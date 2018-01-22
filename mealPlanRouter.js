const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {MealPlan} = require('./models/mealPlan');


router.get('/', jsonParser, (req, res) => {
  MealPlan
    .find()
    .then(mealPlan => res.status(200).json(mealPlan))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});


router.get('/:id', jsonParser, (req, res) => {
  MealPlan
    .findById(req.params.id)
    .then(mealPlan => res.status(200).json(mealPlan))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});


// NEED TO ADD RECIPE INGREDIENTS
router.get('/:id/shoppinglist', jsonParser, (req, res) => {
  let shoppingList = []

  MealPlan
    .findById(req.params.id)
    .then(mealPlan => res.status(200).json(mealPlan.additionalItemNames))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});


router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['name', 'recipeNames'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\``
      console.error(message);
      return res.status(400).send(message);
    }
  }
  MealPlan
    .create({
      name: req.body.name,
      recipeNames: [req.body.recipeNames]})
    .then(mealPlan => res.status(201).json(mealPlan))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


router.put('/:id', jsonParser ,(req, res) => {
  console.log('?????????????? ', req.params, ' ?????????????????');
  console.log('!!!!!!!!!!!!!! ', req.body, ' !!!!!!!!!!!!!!');
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    // we return here to break out of this function
    return res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['name', 'recipeNames', 'additionalItemNames'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  })
  MealPlan
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(mealPlan => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


router.delete('/:id', (req, res) => {
  MealPlan
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = router;
