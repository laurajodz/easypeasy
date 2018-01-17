const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const {Recipes} = require('../models/recipes');
const {MealPlan} = require('../models/mealPlan');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');


function seedRecipesData() {
  console.info('seeding recipes data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateRecipesData());
  }
  return Recipes.insertMany(seedData);
}

function generateRecipeNames() {
  const recipeNames = [
    'Pot Roast', 'Dumplings', 'Chicken Salad', 'Pizza', 'Spaghetti & Meatballs',
    'Lasagna', 'Vegetarian Chilli', 'Kens Noodles'];
  return recipeNames[Math.floor(Math.random() * recipeNames.length)];
}

function generateRecipesData() {
  return {
    name: generateRecipeNames(),
    image: faker.image.food(),
    ingredients: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    url: faker.internet.domainName(),
    source: faker.company.companyName()
  }
}

function seedMealPlanData() {
  console.info('seeding meal plan data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateMealPlanData());
  }
  return MealPlan.insertMany(seedData);
}

function generateMealPlanData() {
  return {
    name: faker.date.future(),
    recipeNames: [{
      name: generateRecipeNames(),
      image: faker.image.food(),
      ingredients: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
      url: faker.internet.domainName(),
      source: faker.company.companyName()
    }],
    additionalItemNames: [generateAdditionalItemNames(), generateAdditionalItemNames(), generateAdditionalItemNames()]
  }
}

function generateAdditionalItemNames() {
  const items = [
    'chocolate bar', 'walnuts', 'flour', 'sugar', 'baking powder', 'salt', 'apples', 'bananas'];
  return items[Math.floor(Math.random() * items.length)];
}


function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('server response', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
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


describe('Recipes API', function() {
  before(function() {
    return runServer();
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

  describe('GET endpoint', function() {

    //TEST: get back all recipes returned by GET request to `/recipes` and
    // prove res has the right status and
    // prove the number of recipes we got back is equal to number in db.

    it('should return all recipes', function() {
      let res;
      return chai.request(app)
        .get('/recipes')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Recipes.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        })
    });

    // TEST:  get back all recipes, and ensure they have expected keys

    it('should return recipes with right fields', function() {
      let resRecipe;
      return chai.request(app)
        .get('/recipes')
        // .then(recipes => {
        //   res.json({
        //     recipes: recipes.map((recipes) => recipes.serialize())
        //   })
        // })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          res.body.forEach(function(recipe) {
            recipe.should.be.a('object');
            recipe.should.include.keys('id', 'name', 'image', 'url', 'ingredients', 'source');
          });
          resRecipe = res.body[0];
          return Recipes.findById(resRecipe.id);
        })
        .then(recipe => {
          resRecipe.name.should.equal(recipe.name);
          resRecipe.image.should.equal(recipe.image);
          resRecipe.url.should.equal(recipe.url);
          resRecipe.ingredients.should.equal(recipe.ingredients);
          eresRecipe.source.should.equal(recipe.source);
        });
    });
  });

  describe('POST endpoint', function() {

    // TEST: post a new recipe and prove that the recipe we get back has the
    // right keys, and that 'id' is there

    it('should add a recipe', function() {
      const newRecipe = generateRecipesData();
      let res;
      console.log(newRecipe);
      return chai.request(app)
        .post('/recipes')
        .send(newRecipe)
        .then(function(_res) {
          res = _res;
          console.log(res.body);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'name', 'image', 'url', 'ingredients', 'source');
          res.body.id.should.not.be.null;
          res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));

          return Recipes.findById(res.body.id);
        })
        .then(function(recipes) {

          expect(res.body.name).to.equal(newRecipe.name);
          expect(res.body.image).to.equal(newRecipe.image);
          expect(res.body.url).to.equal(newRecipe.url);
          expect(res.body.ingredients).to.equal(newRecipe.ingredients);
          expect(res.body.source).to.equal(newRecipe.source);
        })
    });
  });

  describe('PUT endpoint', function() {

    // TEST: get an existing recipe from the db and make a PUT request to update
    // that recipe and prove the recipe returned by request contains the data we
    // sent and prove the recipe in the db is correctly updated

    it('should update a recipe', function() {
      const updateData = {
        name: 'milkshake',
        image: 'google.com/milkshake',
        url: 'google.com',
        ingredients: ['2 tbsp cocoa', '2 cups chocolate ice cream', '1 cup milk'],
        source: 'Anthony Bourdain'};

      return Recipes
        .findOne()
        .then(function(recipes) {
          updateData.id = recipes.id;

          return chai.request(app)
            .put(`/recipes/${recipes.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Recipes.findById(updateData.id);
        })
        .then(function(recipes) {
          console.log(updateData);
          console.log(recipes);
          expect(recipes.name).to.equal(updateData.name);
          expect(recipes.image).to.equal(updateData.image);
          expect(recipes.url).to.equal(updateData.url);
          expect(recipes.ingredients).to.equal(updateData.ingredients);
          expect(recipes.source).to.equal(updateData.source);
        });
    });
  });

  describe('DELETE endpoint', function() {

    // TEST: get a recipe and make a DELETE request for that recipe's id and
    // prove the response has the right code and prove the recipe with that id
    // no longer exists in the db

    it('should delete a recipe', function() {
      let recipe;

      return Recipes
        .findOne()
        .then(function(_recipe) {
          recipe = _recipe;
          return chai.request(app).delete(`/recipes/${recipe.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Recipes.findById(recipe.id);
        })
        .then(function(_recipe) {
          expect(_recipe).to.be.null;
        });
    });
  });
})








describe('MealPlan API', function() {
  before(function() {
    return runServer();
  });
  beforeEach(function() {
    return seedMealPlanData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all meal plans', function() {
      let res;
      return chai.request(app)
        .get('/mealplan')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return MealPlan.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        })
    });


    it('should return plans with right fields', function() {
      let resPlan;
      return chai.request(app)
        .get('/mealplan')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function(plan) {
            console.log('------------------- ', plan)
            plan.should.be.a('object');
            plan.should.include.keys('id', 'name', 'recipeNames', 'additionalItemNames');
          });
          resPlan = res.body[0];
          return MealPlan.findById(resPlan.id);
        })
        .then(plan => {
          resPlan.id.should.equal(plan.id);
          resPlan.name.should.equal(plan.name);
          resPlan.recipeNames.should.equal(plan.recipeNames);
          resPlan.additionalItemNames.should.equal(plan.additionalItemNames);
        });
    });


    //NEED TO ADD RECIPE INGREDIENTS (recipeNames.ingredients)
    it('should list all shopping list items on GET to /mealplan/id/shoppinglist', function() {
      let res;
      let shoppingList = []
      return MealPlan
        .findOne()

      return chai.request(app)
        .get('/mealplan/:id/shoppinglist')
        .then(function(_res) {
          res = _res;
          console.log(res.body.mealplan.additionalItemNames);
          console.log(res.body.mealplan.recipeNames.ingredients);
          expect(res).to.have.status(200);
          shoppingList = res.body.mealplan.additionalItemNames.concat(res.body.mealplan.recipeNames.ingredients);
          expect(shoppingList).to.have.length.of.at.least(1);
          return shoppingList.count();
          // expect(res.body.mealplan.additionalItemNames).to.have.length.of.at.least(1);
          // return MealPlan.additionalItemNames.count();
        })
        .then(function(count) {
          console.log(shoppingList);
          // expect(res.body.mealplan.additionalItemNames).to.have.length.of(count);
          expect(shoppingList).to.have.length.of(count);
        })
    });
  });


  describe('POST endpoint', function() {

    it('should add a new meal plan', function() {
    const newPlan = generateMealPlanData();
    console.log(newPlan);
    return chai.request(app)
      .post('/mealplan')
      .send(newPlan)
      .then(function(res) {
        console.log(res.body);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'recipeNames');
        res.body.id.should.not.be.null;
        res.body.name.should.equal(newPlan.name);
        res.body.recipeNames.should.equal(newPlan.recipeNames);
        res.body.should.deep.equal(Object.assign(newMealPlan, {id: res.body.id}));

        return MealPlan.findById(res.body.id);
      })
      .then(function(plan) {
        res.body.id.should.be.equal.to(newMealPlan.id);
        plan.name.should.equal(newPlan.name);
        plan.recipeNames.should.equal(newPlan.recipeNames);
        plan.additionalItemNames.should.equal(newPlan.additionalItemNames);
      });
    });
  });

  describe('PUT endpoint', function() {

    it('should update a meal plan', function() {
      const updateData = {
        recipeNames: generateRecipesData(),
        additionalItemNames: [generateAdditionalItemNames(), generateAdditionalItemNames(),
        generateAdditionalItemNames()]
      };
      return MealPlan
        .findOne()
        .then(function(mealplan) {
          updateData.id = mealplan.id;

      return chai.request(app)
        .put(`/mealplan/${mealplan.id}`)
        .send(updateData)
        })
        .then(function(res) {
          res.should.have.status(204);

          return MealPlan.findById(updateData.id);
        })
        .then(function(mealplan) {
          expect(mealplan.name).to.equal(updateData.name);
          expect(mealplan.recipeNames).to.equal(updateData.recipeNames);
          expect(mealplan.additionalItemNames).to.equal(updateData.additionalItemNames);
        })
    });
  });


  describe('DELETE endpoint', function() {

    it('should delete a meal plan', function() {
      let mealplan;

      return MealPlan
        .findOne()
        .then(function(_mealplan) {
          mealplan = _mealplan;
          return chai.request(app).delete(`/mealplan/${mealplan.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return MealPlan.findById(mealplan.id);
        })
        .then(function(_mealplan) {
          expect(_mealplan).to.be.null;
        })
    });
  });
});
