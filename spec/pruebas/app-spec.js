let app = require("C:/Users/Vicente Guerra/Documents/PPP 2/proyecto_ppp/index.js");
var request = require('request');

describe('Server', () => {
  describe('Index', () => {
    it('returns a JSON payload', (done) => {
      request(app)
        .get('/rest/service/v1/categories')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((error) => (error) ? done.fail(error) : done());
    });
  });
});