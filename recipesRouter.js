const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {recipes} = require('./models/recipes');


router.get('/', jsonParser, (req, res) => {
  Recipes
    .find()
    .limit(12)
    .then(recipes => {
      res.json(recipes)
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});


router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['name', 'url', 'image', 'ingredients', 'source'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\``
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Recipes
    .create({
      name: req.body.name,
      url: req.body.url,
      image: req.body.image,
      ingredients: req.body.ingredients,
      source: req.body.source})
    .then(recipes => res.status(201).json(recipes))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    // we return here to break out of this function
    return res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['name', 'image', 'ingredients', 'url', 'source'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Recipes
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(recipes => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


router.delete('/:id', (req, res) => {
  Recipes
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = router;
