const chai = require('chai');
const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');

const should = chai.should();

chai.use(chaiHttp);

const {recipes} = require('../models/recipes');
const {shoppingList} = require('../models/shoppingList');
const {mealPlan} = require('../models/mealPlan');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

describe('server response', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should reach localhost successfully', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
      });
  });
});


describe('Recipes', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should list all recipes on GET', function() {
  return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      const expectedKeys = ['name', 'image', 'url', 'ingredients', 'source'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });
  it('should add a recipe on POST', function() {
    const newItem = {
      name: 'Turkey sandwich',
      image: 'a test image',
      url: 'a test url',
      ingredients: ['bread', 'mayo', 'turkey'],
      source: 'a test source'};
    return chai.request(app)
      .post('/recipes')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('name', 'image', 'url', 'ingredients', 'source');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });
  it('should update a recipe on PUT', function() {
    const updateData = {
      name: 'milkshake',
      ingredients: ['2 tbsp cocoa', '2 cups chocolate ice cream', '1 cup milk']};
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
  it('should delete a recipe on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
  it('should throw an error if ingredients are not provided on PUT', function() {
    const updateData = {
      name: 'milkshake'}
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(400);
      }).catch(function(err) {
        err.should.have.status(400);
      });
    });

})


describe('shoppingList', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should list all shopping list items on GET', function() {
  return chai.request(app)
    .get('/shopping-list')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      const expectedKeys = ['name', 'itemNames', 'recipeName'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });
  it('should add a shopping list item on POST', function() {
    const newItem = {
      item: '2 whole apples'};
    return chai.request(app)
      .post('/shopping-list')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('item');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });
  it('should update a shopping list item on PUT', function() {
    const updateData = {
      item: '1 cup flour'};
    return chai.request(app)
      .get('/shopping-list')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/shopping-list/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
  it('should delete a shopping list item on DELETE', function() {
    return chai.request(app)
      .get('/shopping-list')
      .then(function(res) {
        return chai.request(app)
          .delete(`/shopping-list/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

})


describe('mealPlan', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  // i don't have a list all function for meal plans
  it('should list all meal plans on GET', function() {
  return chai.request(app)
    .get('/meal-plan')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      const expectedKeys = ['name', 'recipeNames'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });
  it('should add a meal plan on POST', function() {
    const newItem = {
      name: 'Week of January 15, 2018',
      recipeNames: ['Shrimp Salad', 'Tacos', 'Spaghetti & Meatballs']};
    return chai.request(app)
      .post('/meal-plan')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('name', 'recipeNames');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });
  // i don't have an update function for meal plan
  it('should update a meal plan on PUT', function() {
    const updateData = {
      recipeNames: ['Shrimp Salad', 'Tacos', 'Spaghetti & Meatballs', 'Taco Salad']};
    return chai.request(app)
      .get('/meal-plan')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/meal-plan/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
  // i don't have a delete function for meal plan
  it('should delete a meal plan on DELETE', function() {
    return chai.request(app)
      .get('/meal-plan')
      .then(function(res) {
        return chai.request(app)
          .delete(`/meal-plan/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

})
