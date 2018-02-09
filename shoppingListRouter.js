const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {MealPlan} = require('./models/mealPlan');
const {ShoppingList} = require('./models/shoppingList');


//shoppingList view end point
router.get('/view/:id', (req, res) => {
  ShoppingList
    .findById(req.params.id)
    .populate('mealPlan')
    .then(shoppingList => {
      res.render('shoppingList', shoppingList);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: '*******Internal server error**********'});
      });
});


// create shopping list end point
router.post('/api/:id', (req, res) => {
  MealPlan
    .findById(req.params.id)
    .populate('recipeNames')
    .then(mealPlan => {
      const list = mealPlan.recipeNames.reduce((acc, curr) => {
        return acc.concat(curr.ingredients);
      }, [])

      ShoppingList
        .create({itemNames: list})
        .then(shoppingList => {
          shoppingList.mealPlan = mealPlan
          return shoppingList.save()
        })
        .then(shoppingList => {
          res.json(shoppingList)
        })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: '*******Internal server error**********'});
      });
})


// shopping list add item end point
router.put('/api/:id/additem', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }
  ShoppingList
    .findById(req.params.id)
    .then(shoppingList => {
      const newItemName = req.body.newItemName
      shoppingList.additionalItemNames.push(newItemName);
      shoppingList.save().then(shoppingList => res.status(201).json({key: shoppingList.additionalItemNames.length-1}))
      .catch(err => res.status(500).json({message: 'Internal server error'}))
    })
})


// shopping list edit an added item end point
router.put('/api/:id/edititem1', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }
  ShoppingList
    .findById(req.params.id)
    .then(shoppingList => {
      const itemToEdit = req.body.itemToEdit;
      shoppingList.additionalItemNames.splice(req.body.key, 1, itemToEdit);
      shoppingList.save().then(shoppingList => res.status(201).end());
    })
    .catch(err => res.status(500).json({message: '!!!Internal server error'}))
})


// shopping list edit a recipe item end point
router.put('/api/:id/edititem2', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }
  ShoppingList
    .findById(req.params.id)
    .then(shoppingList => {
      const itemToEdit = req.body.itemToEdit;
      shoppingList.itemNames.splice(req.body.key, 1, itemToEdit);
      shoppingList.save().then(shoppingList => res.status(201).end());
    })
    .catch(err => res.status(500).json({message: '!!!Internal server error'}))
})


// shopping list delete an added item end point
router.put('/api/:id/delitem1', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }
  ShoppingList
    .findById(req.params.id)
    .then(shoppingList => {
      const itemToDelete = req.body.itemToDelete;
      const index = shoppingList.additionalItemNames.indexOf(itemToDelete);
      shoppingList.additionalItemNames.splice(index, 1);
      shoppingList.save().then(shoppingList => res.status(204).end());
    })
    .catch(err => res.status(500).json({message: '!!!Internal server error'}))
})


// shopping list delete a recipe item end point
router.put('/api/:id/delitem2', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }
  ShoppingList
    .findById(req.params.id)
    .then(shoppingList => {
      const itemToDelete = req.body.itemToDelete;
      const index = shoppingList.itemNames.indexOf(itemToDelete);
      shoppingList.itemNames.splice(index, 1);
      shoppingList.save().then(shoppingList => res.status(204).end());
    })
    .catch(err => res.status(500).json({message: '!!!Internal server error'}))
})



module.exports = router;
