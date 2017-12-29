const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Shopping List', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should reach endpoint successfully', function() {
    return chai.request(app)
      .get('/shopping-list')
      .then(function(res) {
        res.should.have.status(200);
      });
  });
});
