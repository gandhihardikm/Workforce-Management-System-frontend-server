var assert = require('assert'),

http = require('http');



describe('/', function () {

  //var url="http://localhost:3232”;



  //test case for getting list of buildings on providing correct url

  it('should return number of buildings', function (done) {

    http.get('http://localhost:3232/getTotalNumberOfAlerts', function (res) {

      assert.equal(200, res.statusCode);

      done();

    });

  });





//test case for not getting list of buildings on providing incorrect url

  it('should not return valid response', function (done) {

    http.get('http://localhost:3232/getGetBuildingList12', function (res) {

      assert.equal(200, res.statusCode);

      done();

    });

  });



  //test case for getting total number of clients on providing correct url

  it('should return number of clients', function (done) {

    http.get('http://localhost:3232/totalNumberOfClients', function (res) {

      assert.equal(200, res.statusCode);

      done();

    });

  });

//test case for getting total number of clients on providing incorrect url

  it('should not return valid response', function (done) {

    http.get('http://localhost:3232/totalNumberOfClients21', function (res) {

      assert.equal(200, res.statusCode);

      done();

    });

  });
});
