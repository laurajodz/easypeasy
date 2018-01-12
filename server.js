const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {PORT, DATABASE_URL} = require('./config');
const {recipes} = require('./models/recipes');
// const {shoppingList} = require('./models/shoppingList');
const {mealPlan} = require('./models/mealPlan');

const app = express();

// const shoppingListRouter = require('./shoppingListRouter');
const recipesRouter = require('./recipesRouter');
const mealPlanRouter = require('./mealPlanRouter');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', './views');
app.set('view engine', 'jade');

// app.use('/shoppingList', shoppingListRouter);
app.use('/recipes', recipesRouter);
app.use('/mealPlan', mealPlanRouter);

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    }).on('error', err => {
      mongoose.disconnect();
      reject(err)
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
      }
      resolve();
    });
  });
})
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

module.exports = {app, runServer, closeServer};
