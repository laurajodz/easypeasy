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

      console.log('----------------- ', {list});

      res.render('shoppingList', {list});
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: '*******Internal serer error**********'});
      });
});

router.put('/mealPlan/api/:id', jsonParser ,(req, res) => {
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

module.exports = router;
