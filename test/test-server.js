const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const {recipes} = require('../models/recipes');
const {mealPlan} = require('../models/mealPlan');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');


function seedRecipesData() {
  console.info('seeding recipes data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateRecipeData());
  }
  return Recipes.insertMany(seedData);
}

function generateAdditionalItemNames() {
  const items = [
    'chocolate bar', 'walnuts', 'flour', 'sugar', 'baking powder', 'salt', 'apples', 'bananas'];
  return items[Math.floor(Math.random() * items.length)];
}

function generateRecipeNames() {
  const recipeNames = [
    'Pot Roast', 'Dumplings', 'Chicken Salad', 'Pizza', 'Spaghetti & Meatballs',
    'Lasagna', 'Vegetarian Chilli', 'Kens Noodles'];
  return items[Math.floor(Math.random() * recipeNames.length)];
}

function generateRecipesData() {
  return {
    name: generateRecipeNames(),
    image: faker.image.food,
    ingredients: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    url: faker.internet.domainName(),
    source: faker.company.companyName()
  }
}

function generateMealPlanData() {
  return {
    name: faker.date.future(),
    recipeNames: [{
      name: generateRecipeNames(),
      image: faker.image.food,
      ingredients: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
      url: faker.internet.domainName(),
      source: faker.company.companyName()
    }],
    additionalItemNames: [generateAdditionalItemNames(), generateAdditionalItemNames(), generateAdditionalItemNames()]
  }
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('server response', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedRecipesData();
  });

  afterEach(function() {
    return tearDownDb();
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

  //TEST: get back all recipes returned by GET request to `/recipes` and
  // prove res has the right status and
  // prove the number of recipes we got back is equal to number in db.

  it('should list all recipes on GET /recipes', function() {
    let res;
    return chai.request(app)
      .get('/recipes')
      .then(function(_res) {
        res = _res;
        res.should.have.status(200);
        res.body.length.should.be.at.least(1);
        return Recipes.count();
      })
      .then(function(count) {
        res.body.length.should.be.length.of(count);
      })
  });

  // TEST:  get back all recipes, and ensure they have expected keys

  it('should return recipes with right fields on GET /recipes', function() {
    let resRecipes;
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
        })
        resRecipes = res.body.recipes[0];
        return Recipes.findById(resRecipes.id);
      })
      .then(function(recipes) {
        resRecipes.name.should.be.equal.to(recipes.name);
        resRecipes.image.should.be.equal.to(recipes.image);
        resRecipes.url.should.be.equal.to(recipes.url);
        resRecipes.ingredients.should.be.equal.to(recipes.ingredients);
        resRecipes.source.should.be.equal.to(recipes.source);
      })
  });


  // TEST: post a new recipe and prove that the recipe we get back has the
  // right keys, and that 'id' is there

  it('should add a recipe on POST to /recipes', function() {
    const newRecipe = generateRecipeData();
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'image', 'url', 'ingredients', 'source');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));

        return Recipes.findById(res.body.id);
      })
      .then(function(recipes) {
        res.body.name.should.be.equal.to(newRecipe.name);
        res.body.image.should.be.equal.to(newRecipe.image);
        res.body.url.should.be.equal.to(newRecipe.url);
        res.body.ingredients.should.be.equal.to(newRecipe.ingredients);
        res.body.source.should.be.equal.to(newRecipe.source);
      })
  });


  // TEST: get an existing recipe from the db and make a PUT request to update
  // that recipe and prove the recipe returned by request contains the data we
  // sent and prove the recipe in the db is correctly updated

  it('should update a recipe on PUT to /recipes/:id', function() {
    const updateData = {
      name: 'milkshake',
      ingredients: ['2 tbsp cocoa', '2 cups chocolate ice cream', '1 cup milk']};
    return chai.request(app)
      .get('/recipes/:id')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);

        return recipes.findById(updateData.id);
      })
      .then(function(recipes) {
        recipes.name.should.be.equal.to(updateData.name);
      })
  });


  // TEST: get a recipe and make a DELETE request for that recipe's id and
  // prove the response has the right code and prove the recipe with that id
  // no longer exists in the db

  it('should delete a recipe on DELETE to /recipes/:id', function() {
    return chai.request(app)
      .get('/recipes/:id')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
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

  it('should list all meal plans on GET to /mealplan', function() {
    let res;
    return chai.request(app)
      .get('/mealplan')
      .then(function(res) {
        res = _res;
        res.should.have.status(200);
        res.body.length.should.be.at.least(1);
        return mealPlan.count();
      })
      .then(function(count) {
        res.body.length.should.be.length.of(count);
      })
  });


  it('should return meal plan with right fields on GET /mealplan', function() {
    let resMealPlan;
    return chai.request(app)
      .get('/mealplan')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['name', 'recipeNames'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        })
        resMealPlan = res.body.mealplan[0];
        return mealPlan.findById(resMealPlan.id);
      })
      .then(function(mealplan) {
        resMealPlan.name.should.be.equal.to(mealplan.name);
        resMealPlan.recipeNames.should.be.equal.to(mealPlan.recipeNames);
      })
  });


    it('should add a meal plan on POST to /mealplan', function() {
    const newMealPlan = generateMealPlanData();
    return chai.request(app)
      .post('/mealplan')
      .send(newMealPlan)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'recipeNames');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newMealPlan, {id: res.body.id}));

        return mealPlan.findById(res.body.id);
      })
      .then(function(mealPlan) {
        res.body.name.should.be.equal.to(newMealPlan.name);
        res.body.recipeNames.should.be.equal.to(newMealPlan.recipeNames);
      })
  });


  it('should update a meal plan on PUT to /mealplan/:id', function() {
    const updateData = {
      recipeNames: generateRecipesData(),
      additionalItemNames: [generateAdditionalItemNames(), generateAdditionalItemNames(),
      generateAdditionalItemNames()]
    };
    return chai.request(app)
      .get('/mealplan/:id')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/mealplan/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(204);

        return mealPlan.findById(updateData.id);
      })
      .then(function(mealplan) {
        mealPlan.name.should.be.equal.to(updateData.name);
      })
  });


  it('should delete a meal plan on DELETE to /mealplan/:id', function() {
    return chai.request(app)
      .get('/mealplan/:id')
      .then(function(res) {
        return chai.request(app)
          .delete(`/mealplan/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});
