const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('server response', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should reach the recipes page successfully', function() {
    return chai.request(app)
      .get('/recipes.html')
      .then(function(res) {
        res.should.have.status(200);
      });
  });

  // it('should reach the meal plan page successfully', function() {
  //   return chai.request(app)
  //     .get('/mealPlan/api')
  //     .then(function(res) {
  //       res.should.have.status(200);
  //     });
  // });

});
