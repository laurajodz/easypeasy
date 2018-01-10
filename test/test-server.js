const chai = require('chai');
const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');

const should = chai.should();

chai.use(chaiHttp);

const {ShoppingList} = require('../models');
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

// describe('GET endpoint', function() {
//
//   it('should return all existing shopping list items', function() {
//     let res;
//     return chai.request(app)
//       .get('/shopping-list')
//       .then(function(_res) {
//         res = _res;
//         res.should.have.status(200);
//         res.body.ShoppingList.should.have.length.of.at.least(1);
//         return ShoppingList.count();
//       })
//       .then(function(count) {
//         res.body.shoppingLit.should.have.length.of(count);
//       });
//   });
// });
