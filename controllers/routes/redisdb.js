var redisDB;
var redis = require('redis');

exports.connect = function() {
  if (!redisDB) { // check if already a redis client is running or not
	  redisDB = redis.createClient(); // if not create one
  }	  
  return redisDB; // return redis client
};

exports.disconnect = function() {
  redis.quit();
  redisDB = null;
};
