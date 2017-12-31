const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

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
      const expectedKeys = ['id', 'name', 'ingredients'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });
  it('should add a recipe on POST', function() {
    const newItem = {name: 'sandwich', ingredients: ['bread', 'mayo', 'turkey']};
    return chai.request(app)
      .post('/recipes')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'ingredients');
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
