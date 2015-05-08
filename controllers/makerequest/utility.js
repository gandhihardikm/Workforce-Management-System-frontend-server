/**
 * April 22,2014
 * This js contains Genric function that will be called to make request to the queue
 */

var ejs=require("ejs");
var mq_client = require('../../rpc/client');

exports.send_request = function(queue_name,message,req,res){
	mq_client.make_request(queue_name, message, function(err,results){
		
		if(err){
			console.log("Post request Error");
			throw err;
		} else  {
			if(results.code === "200"){
				res.send({"value":"Success", "status": true});
			} else {    
				res.send({"value":"Fail", "status":false});
			}
		}  
	});
};


exports.get_request = function(queue_name,message,req,res){
	mq_client.make_request(queue_name,message, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200)
			{
				res.send({"value":"Success", "status": true,"resultsData":results.resultsData});  
			}
			else {    
				
				res.send({"value":"Fail", "status": true});
			}
		}  
	});
};

function checkIfReceivedVariableIsInt (variable) {
	if ((Object.prototype.toString.call(parseInt(variable)) === '[object Number]')) {
		return true;
	} else {
		return false;
	}
}

function checkIfReceivedVariableIsString (variable) {
	if ((Object.prototype.toString.call(variable) === '[object String]')) {
		return true;
	} else {
		return false;
	}
}

function checkIfReceivedVariableIsDate (variable) {
	if (variable.match((/(\d{4})(?:\/|-)(\d{2})(?:\/|-)(\d{2})/)) || variable.match((/(\d{2})(?:\/|-)(\d{2})(?:\/|-)(\d{4})/))) {
		return true;
	} else {
		return false;
	}
}

function checkIfReceivedVariableIsEmail (variable) {
	if (variable.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
		return true;
	} else {
		return false;
	}
}

exports.checkInt = checkIfReceivedVariableIsInt; 
exports.checkString = checkIfReceivedVariableIsString;
exports.checkDate = checkIfReceivedVariableIsDate;
exports.checkEmail = checkIfReceivedVariableIsEmail;