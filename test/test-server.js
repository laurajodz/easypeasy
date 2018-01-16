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
      let resRecipes;
      return chai.request(app)
        .get('/recipes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          const expectedKeys = ('id', 'name', 'image', 'url', 'ingredients', 'source');
          res.body.forEach(function(recipes) {
            expect(recipes).to.be.a('object');
            expect(recipes).to.include.keys(expectedKeys);
          });
          resRecipes = res.body[0];
          return Recipes.findById(resRecipes.id);
        })
        .then(function(recipes) {
          expect(resRecipes.name).to.equal(recipes.name);
          expect(resRecipes.image).to.equal(recipes.image);
          expect(resRecipes.url).to.equal(recipes.url);
          expect(resRecipes.ingredients).to.equal(recipes.ingredients);
          expect(resRecipes.source).to.equal(recipes.source);
        });
    });
  });

  describe('POST endpoint', function() {

    // TEST: post a new recipe and prove that the recipe we get back has the
    // right keys, and that 'id' is there

    it('should add a recipe', function() {
      const newRecipe = generateRecipesData();
      console.log(newRecipe);
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

    // it('should return meal plan with right fields', function() {
    //   let resMealPlan;
    //   return chai.request(app)
    //     .get('/mealplan')
    //     .then(function(res) {
    //       res.should.have.status(200);
    //       res.should.be.json;
    //       res.body.should.be.a('array');
    //       res.body.length.should.be.at.least(1);
    //       const expectedKeys = ['name', 'recipeNames'];
    //       res.body.forEach(function(item) {
    //         item.should.be.a('object');
    //         item.should.include.keys(expectedKeys);
    //       })
    //       resMealPlan = res.body.mealplan[0];
    //       return mealPlan.findById(resMealPlan.id);
    //     })
    //     .then(function(mealplan) {
    //       resMealPlan.name.should.be.equal.to(mealplan.name);
    //       resMealPlan.recipeNames.should.be.equal.to(mealPlan.recipeNames);
    //     })
    // });


    // NEED TO ADD RECIPE INGREDIENTS
    it('should list all shopping list items on GET to /mealplan/id/shoppinglist', function() {
      let res;
      return chai.request(app)
        .get('/mealplan/:id/shoppinglist')
        .then(function(res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.mealplan.additionalItemNames).to.have.length.of.at.least(1);
          return MealPlan.additionalItemNames.count();
        })
        .then(function(count) {
          expect(res.body.mealplan.additionalItemNames).to.have.length.of(count);
        })
    });
  });

  describe('POST endpoint', function() {

    it('should add a meal plan', function() {
    const newMealPlan = generateMealPlanData();
    console.log(newMealPlan);
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
  });

  describe('PUT endpoint', function() {

    it('should update a meal plan', function() {
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
