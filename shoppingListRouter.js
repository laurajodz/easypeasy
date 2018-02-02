const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {MealPlan} = require('./models/mealPlan');
const {ShoppingList} = require('./models/shoppingList');


// create shopping list end point
router.post('/api/:id', (req, res) => {
  MealPlan
    .findById(req.params.id)
    .populate('recipeNames')
    .then(mealPlan => {
      console.log('About to render', mealPlan);

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

      console.log('----------------- ', {list});
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
      shoppingList.save().then(shoppingList => res.status(204).end())
      .catch(err => res.status(500).json({message: 'Internal server error'}))
    })
})


// shopping list delete item end point
router.put('/api/:id/delitem', jsonParser, (req, res) => {
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
      res.render('mealPlan', {list, additionalItems, id: mealPlan._id});
      console.log('item to delete is ', itemToDelete);
      console.log('index is ', index);
    })
    .catch(err => res.status(500).json({message: '!!!Internal server error'}))
})


//shoppingList view end point
router.get('/view/:id', (req, res) => {
console.log('Shopping list view');
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


module.exports = router;
