const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const {Recipes} = require('../models/recipes');
const {MealPlan} = require('../models/mealPlan');
const {ShoppingList} = require('../models/shoppingList');
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
    name: faker.lorem.words(),
    recipeNames: [
      generateRecipesData(),
      generateRecipesData(),
      generateRecipesData()
    ]
  }
}

function generateAdditionalItemNames() {
  const items = [
    'chocolate bar', 'walnuts', 'flour', 'sugar', 'baking powder', 'salt', 'apples', 'bananas'];
  return items[Math.floor(Math.random() * items.length)];
}

function seedShoppingListData() {
  console.info('seeding shopping list data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateShoppingListData());
  }
  return ShoppingList.insertMany(seedData);
}

function generateShoppingListData() {
  return {
    itemNames: [
      generateItemNames(),
      generateItemNames(),
      generateItemNames()
    ]
  }
}

function generateItemNames() {
  const items = [
    '1 tsp salt', '1 cup sugar', '2 tbsp peanut butter', '1/2 cup flour', '16 oz pasta'];
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

  // describe('GET endpoint', function() {
  //
  //   it('should return all meal plans', function() {
  //     let res;
  //     return chai.request(app)
  //       .get('/mealplan/api')
  //       .populate('recipeNames')
  //       .then(function(_res) {
  //         res = _res;
  //         console.log("yesssss ", res);
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.have.lengthOf.at.least(1);
  //         return MealPlan.count();
  //       })
  //       .then(function(count) {
  //         expect(res.body).to.have.lengthOf(count);
  //       })
  //   });
  //
  //
  //   it('should return plans with right fields', function() {
  //     let resPlan;
  //     return chai.request(app)
  //       .get('/mealplan')
  //       .populate('recipeNames')
  //       .then(function (res) {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body.should.be.a('array');
  //         res.body.should.have.length.of.at.least(1);
  //
  //         res.body.forEach(function(plan) {
  //           console.log('------------------- ', plan)
  //           plan.should.be.a('object');
  //           plan.should.include.keys('_id', 'name', 'recipeNames', 'additionalItemNames');
  //         });
  //         resPlan = res.body[0];
  //         return MealPlan.findById(resPlan._id);
  //       })
  //       .then(plan => {
  //         resPlan.name.should.equal(plan.name);
  //         // resPlan.recipeNames.should.equal(plan.recipeNames);
  //         resPlan.additionalItemNames.length.should.equal(plan.additionalItemNames.length);
  //       });
  //   });
  //

  //do not need this as it is part of meal plan get
  //   it('should list all shopping list items on GET to /mealplan/api/id/shoppinglist', function() {
  //     let res;
  //     let shoppingList = []
  //     return MealPlan
  //       .findOne()
  //       .populate('recipeNames')
  //     return chai.request(app)
  //       .get('/mealplan/:id/shoppinglist')
  //       .then(function(_res) {
  //         res = _res;
  //         console.log(res.body.mealplan.additionalItemNames);
  //         console.log(res.body.mealplan.recipeNames.ingredients);
  //         expect(res).to.have.status(200);
  //         shoppingList = res.body.mealplan.additionalItemNames.concat(res.body.mealplan.recipeNames.ingredients);
  //         expect(shoppingList).to.have.length.of.at.least(1);
  //         return shoppingList.count();
  //         // expect(res.body.mealplan.additionalItemNames).to.have.length.of.at.least(1);
  //         // return MealPlan.additionalItemNames.count();
  //       })
  //       .then(function(count) {
  //         console.log(shoppingList);
  //         // expect(res.body.mealplan.additionalItemNames).to.have.length.of(count);
  //         expect(shoppingList).to.have.length.of(count);
  //       })
  //   });
  // });

  //THIS IS END POINT #1
  describe('POST endpoint', function() {

    it('should add a new meal plan', function() {
    const newPlan = generateMealPlanData();
    console.log('--------newPlan---------- ', newPlan, '----------');
    return chai.request(app)
      .post('/mealplan/api')
      .send(newPlan)
      .then(function(res) {
        console.log('**********res.body********** ', res.body, '***********');
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('_id', 'name', 'recipeNames');
        res.body._id.should.not.be.null;
        res.body.name.should.equal(newPlan.name);

        return MealPlan.findById(res.body._id);
      })
      .then(function(plan) {
        plan.name.should.equal(newPlan.name);
      });
    });
  });

});
  // describe('PUT endpoint', function() {
  //
  //   it('should update a meal plan', function() {
  //     const updateData = {
  //       recipeNames: [generateRecipesData(), generateRecipesData(), generateRecipesData()],
  //       additionalItemNames: [generateAdditionalItemNames(), generateAdditionalItemNames(),
  //       generateAdditionalItemNames()]
  //     };
  //     console.log('------------------- ', updateData, ' -------------------');
      // return MealPlan
      //   .findOne()
      //   .then(function(mealplan) {
      //     updateData.id = mealplan._id;
      //
      // return chai.request(app)
      //   .put(`/mealplan/${mealplan._id}`)
      //   .send(updateData)
      //   })
      //   .then(function(res) {
      //     res.should.have.status(204);
      //
      //     return MealPlan.findById(updateData.id);
      //   })
      //   .then(function(mealplan) {
      //     console.log('#################### ', mealplan, ' ####################');
          // expect(mealplan.name).to.equal(updateData.name);
          // expect(mealplan.recipeNames.length).to.equal(updateData.recipeNames.length);
  //         expect(mealplan.additionalItemNames.length).to.equal(updateData.additionalItemNames.length);
  //       })
  //   });
  // });

//
//   describe('DELETE endpoint', function() {
//
//     it('should delete a meal plan', function() {
//       let mealplan;
//
//       return MealPlan
//         .findOne()
//         .then(function(_mealplan) {
//           mealplan = _mealplan;
//           return chai.request(app).delete(`/mealplan/${mealplan.id}`);
//         })
//         .then(function(res) {
//           res.should.have.status(204);
//           return MealPlan.findById(mealplan.id);
//         })
//         .then(function(_mealplan) {
//           expect(_mealplan).to.be.null;
//         })
//     });
//   });
// });

describe('ShoppingList API', function() {
  before(function() {
    return runServer();
  });
  beforeEach(function() {
    return seedShoppingListData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });


  //THIS IS END POINT #2
  describe('PUT endpoint', function() {

    it('should add a shopping list item', function() {
      const updateData = {
        additionalItemNames: generateAdditionalItemNames(),
      };
      console.log('------------------- ', updateData, ' -------------------');
      return ShoppingList
        .findOne()
        .then(function(shoppinglist) {
          updateData.id = shoppinglist._id;
          return chai.request(app)
            .put(`/shoppingList/api/${updateData.id}/additem`)
            .send(updateData);
        })
        .then(function(res) {
          console.log('*****************', updateData, ' *********************');
          res.should.have.status(201);
          return ShoppingList.findById(updateData.id);
        })
        .then(function(shoppinglist) {
          console.log('#################### ', shoppinglist, ' ####################');
          console.log('! ', shoppinglist.additionalItemNames, updateData.additionalItemNames);
          expect(shoppinglist.additionalItemNames.length).to.equal(updateData.additionalItemNames.length);
        })
    });
  });


  //THIS IS END POINT #3
  describe('PUT endpoint', function() {

    it('should edit an added shopping list item', function() {

      const key = $(event.target).data('key');

      const updateData = {
        additionalItemNames: generateAdditionalItemNames(),
      };
      console.log('------------------- ', updateData, ' -------------------');
      return ShoppingList
        .findOne()
        .then(function(shoppinglist) {
          updateData.id = shoppinglist._id;

          return chai.request(app)
            .put(`/shoppingList/api/${updateData.id}/edititem1`)
            .send(updateData);
        })
        .then(function(res) {
          console.log('*****************', updateData, ' *********************');
          res.should.have.status(201);
          return ShoppingList.findById(updateData.id);
        })
        .then(function(shoppinglist) {
          console.log('#################### ', shoppinglist, ' ####################');
          console.log('! ', shoppinglist.additionalItemNames, updateData.additionalItemNames);
          expect(shoppinglist.additionalItemNames.length).to.equal(updateData.additionalItemNames.length);
        })
    });
  });


  //THIS IS END POINT #4
  describe('PUT endpoint', function() {

    it('should edit a recipe shopping list item', function() {

      const key = $(event.target).data('key');

      const updateData = {
        itemName: generateItemNames(),
      };
      console.log('------------------- ', updateData, ' -------------------');
      return ShoppingList
        .findOne()
        .then(function(shoppinglist) {
          updateData.id = shoppinglist._id;

          return chai.request(app)
            .put(`/shoppingList/api/${updateData.id}/edititem2`)
            .send(updateData);
        })
        .then(function(res) {
          console.log('*****************', updateData, ' *********************');
          res.should.have.status(201);
          return ShoppingList.findById(updateData.id);
        })
        .then(function(shoppinglist) {
          console.log('#################### ', shoppinglist, ' ####################');
          console.log('! ', shoppinglist.additionalItemNames, updateData.additionalItemNames);
          expect(shoppinglist.additionalItemNames.length).to.equal(updateData.additionalItemNames.length);
        })
    });
  });


  //THIS IS END POINT #5
  describe('PUT endpoint', function() {

    it('should delete an added shopping list item', function() {

      generateMealPlanData();
      
      const updateData = {
        additionalItemNames: generateAdditionalItemNames(),
      };
      console.log('------------------- ', updateData, ' -------------------');
      return ShoppingList
        .findOne()
        .then(function(shoppinglist) {
          updateData.id = shoppinglist._id;

          return chai.request(app)
            .put(`/shoppingList/api/${updateData.id}/delitem1`)
            .send(updateData);
        })
        .then(function(res) {
          console.log('*****************', updateData, ' *********************');
          res.should.have.status(201);
          return ShoppingList.findById(updateData.id);
        })
        .then(function(shoppinglist) {
          console.log('#################### ', shoppinglist, ' ####################');
          console.log('! ', shoppinglist.additionalItemNames, updateData.additionalItemNames);
          expect(shoppinglist.additionalItemNames.length).to.equal(updateData.additionalItemNames.length);
        })
    });
  });


  //THIS IS END POINT #6
  describe('PUT endpoint', function() {

    it('should delete a recipe shopping list item', function() {

      generateMealPlanData();

      const updateData = {
        itemName: generateItemNames(),
      };
      console.log('------------------- ', updateData, ' -------------------');
      return ShoppingList
        .findOne()
        .then(function(shoppinglist) {
          updateData.id = shoppinglist._id;

          return chai.request(app)
            .put(`/shoppingList/api/${updateData.id}/delitem2`)
            .send(updateData);
        })
        .then(function(res) {
          console.log('*****************', updateData, ' *********************');
          res.should.have.status(201);
          return ShoppingList.findById(updateData.id);
        })
        .then(function(shoppinglist) {
          console.log('#################### ', shoppinglist, ' ####################');
          console.log('! ', shoppinglist.additionalItemNames, updateData.additionalItemNames);
          expect(shoppinglist.additionalItemNames.length).to.equal(updateData.additionalItemNames.length);
        })
    });
  });


});
