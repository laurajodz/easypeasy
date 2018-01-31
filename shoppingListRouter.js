const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {MealPlan} = require('./models/mealPlan');


//shoppingList view end point
router.get('/view/:id', (req, res) => {
console.log('Shopping list view');
  MealPlan
    .findById(req.params.id)
    .populate('recipeNames')
    .then(mealPlan => {
      console.log('About to render', mealPlan);

      const list = mealPlan.recipeNames.reduce((acc, curr) => {
        return acc.concat(curr.ingredients);
      }, [])

      const additionalItems = mealPlan.additionalItemNames;

      console.log('----------------- ', {list});

      res.render('shoppingList', {list, additionalItems, id: mealPlan._id});
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: '*******Internal serer error**********'});
      });
});


module.exports = router;
