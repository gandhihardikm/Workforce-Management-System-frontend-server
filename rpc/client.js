var amqp = require('amqp');

var connection = amqp.createConnection({host:'127.0.0.1'});
var rpc = new (require('./amqprpc'))(connection);


function make_request(queue_name, msg_payload, callback){
	
	rpc.makeRequest(queue_name, msg_payload, function(err, response){
		if(err) {
			console.log("client.js Error Printing...");
			
			console.error(err);
			var res = {};
			res.code = "400";
			res.value = "Fail";
			res.status = false;
			res.Message = "Error Connecting to DB.";
			callback(null, res);
		} else{
			console.log("Client.js Response : ", response);
			callback(null, response);
		}
		//connection.end();
	});
}

exports.make_request = make_request;
