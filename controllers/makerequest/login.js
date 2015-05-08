var mq_client = require('../../rpc/client');
var utility = require('./utility');

function after_login (req, res) {
	var ssn = req.param("userssn");
	
	var correctedssn = ssn.replace(/-/g,"");
	//console.log("Corrected ssn : "+ correctedssn);
	var password = req.param("password");
	console.log (Object.prototype.toString.call(parseInt(req.param("userssn"))) + " " + Object.prototype.toString.call(req.param("password"))) ;
	//if (utility.checkInt(ssn) && utility.checkString(password)) {
		var msg_payload = { "ssn": correctedssn, "password": password, "type" : "login" };
		
		console.log("In POST Request = email:"+ ssn +" "+password);
		
		mq_client.make_request('login_queue', msg_payload, function(err,results){
			
			console.log("Results: "+ results.code);
			if(err){
				console.log("Post request Error");
			} else  {
				if(results.code === "200"){
					console.log("valid Login");
					console.log(results);
					
					req.session.ssn = results.login.person_ssn;
					console.log("Session:"+req.session.ssn+"Server:"+results.login.person_ssn);
					res.send({"value":"Success", "status": true, "login": results.login});
				} else {    
					
					res.send({"value":"Fail", "status":false,"Message":results.Message});
				}
			}  
		});
	//} else {
	//	res.send({"value":"Fail", "status":false, "Message":"Please enter both the values to login"});
	//}
	
}

function logout (req,res){
	var msg_payload = { "ssn": req.session.ssn, 
			"type" : "logout" };
	
	console.log("In logout");
	
	mq_client.make_request('login_queue', msg_payload, function(err,results){
		
		console.log("Results: "+ results.code);
		if(err){
			console.log("logout Post request Error");
			throw err;
		} else  {
			if(results.code === "200"){
				
				console.log("Session destroyed.");
				req.session.destroy();
				res.send({"value":"Success", "status": true});
			} else {    
				console.log("Session not destroyed.");
				res.send({"value":"Fail", "status":false});
			}
		}  
	});
}

exports.logout = logout;
exports.after_login = after_login;