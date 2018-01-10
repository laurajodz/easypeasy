const express = require('express');
const morgan = require('morgan');
const router = express.Router();
// const mongoose = require('mongoose');
//
// mongoose.Promise = global.Promise;

// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// var index = require('./routes/index');
// var users = require('./routes/users');

const {PORT, DATABASE_URL} = require('./config');
const {Recipes} = require('./models');
const {ShoppingList} = require('./models');
const {MealPlan} = require('./models');

const app = express();

const shoppingListRouter = require('./shoppingListRouter');
const recipesRouter = require('./recipesRouter');
const mealPlanRouter = require('./mealPlanRouter');


app.use('/shoppingList', shoppingListRouter);
app.use('/recipes', recipesRouter);
app.use('/mealPlan', mealPlanRouter);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', './views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static('public'));

// app.use('/', index);
// app.use('/users', users);

app.use(morgan('common'));


//temp mock data
ShoppingList.create('eggs', 'whole', 1);
ShoppingList.create('milk', 'quart(s)', 2);
ShoppingList.create('bread', 'slices', 4);

Recipes.create(
  'Fried Chicken', 'http://recipesgalore.friedchicken.com', '/friedchicken.jpg', ['1 pound chicken', '1 cup flour', '4 tbsp butter']);
Recipes.create(
  'Salad', 'http://recipesgalore.salad', '/salad.jpg', ['2 whole carrots', '2 cups lettuce', '1 whole cucumber']);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});




app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  const requiredFields = ['name', 'unit', 'amount'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\``
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = ShoppingList.create(req.body.name, req.body.unit, req.body.amount);
  res.status(201).json(item);
});

app.delete('/shopping-list/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.id}\``);
  res.status(204).end();
});

app.put('/shopping-list/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'unit', 'amount', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\``
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `IDs (${req.params.id}) and (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    unit: req.body.unit,
    amount: req.body.amount
  });
  res.status(204).end();
});





app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

//add a recipe to meal plan
app.post('/recipes', jsonParser, (req, res) => {
  const requiredFields = ['name', 'url', 'photo', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\``
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Recipes.create(req.body.name, req.body.url, req.body.photo, req.body.ingredients);
  res.status(201).json(item);
});

//delete from meal plan
app.delete('/recipes/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted recipe \`${req.params.id}\``);
  res.status(204).end();
});

//get meaal plan
app.get('/meal-plan', (req, res) => {
  res.json(MealPlan.get());
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

// app.listen(process.env.PORT || 8080);

module.exports = {app, runServer, closeServer};
