const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

describe("Post Api Test", function () {
  it('should return a list of posts', (done) => {
    chai
      .request(app)
      .get('/post')
      .end((err, res) => {
        if (err) return done(err); // Fail the test if there's an error
        console.log('Response received:', res.body);
        expect(res).to.have.status(200);
        expect(JSON.parse(res.body.data)).to.be.an('array');
        done(res); // Mark the test as finished
      });
  });
  
});
