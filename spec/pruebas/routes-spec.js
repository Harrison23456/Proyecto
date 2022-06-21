var request = require('request');
let app = require("C:/Users/Vicente Guerra/Documents/PPP 2/proyecto_ppp/routes/router.js");

it("should respond with hello world", function(done) {
  request(app, function(error, response, body){
    done();
  });
}, 250);