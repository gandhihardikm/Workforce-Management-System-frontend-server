var mq_client = require('../../rpc/client');
var utility = require('./utility');


function get_timeline_details (req,res){
	console.log("guard mediator Inside get timeline ");
	var msg_payload = {
			"type":"gettimeline",
			"GuardSSN":req.session.ssn,
	};
	utility.get_request('guard_queue',msg_payload,req,res);
}

// function to get building list onto the schedule page
function get_building_list (req,res){ 
	console.log("guard mediator Inside get building list ");
	var msg_payload = {
			"type":"getBuildingList",
			"GuardSSN":req.session.ssn,
	};
	utility.get_request('guard_queue',msg_payload,req,res);
}

function get_alert_types(req,res){
	console.log("Inside get alert types:" );
	var msg_payload = {
			"type":"getalerttype"
	};
	utility.get_request('guard_queue',msg_payload,req,res);
}


function add_alert (req, res) {
	console.log("ssn in add_alert:"+req.session.ssn);
	//if (utility.checkDate(req.param("Date")))
	//{
		var msg_payload = { 
				"alertDescription": req.param("Description"),
				"alertDate": req.param("Date"),
				"alertTime": req.param("Time"),
				"alertCheckpoint":req.param("Checkpoint"),
				"alertBuilding":req.param("Building"),
				"alertType":req.param("Type"),
				"alertSeverity":req.param("Severity"),
				"alertGuardSSN":req.session.ssn,
				"type":"addalert"
			   };
		utility.send_request('guard_queue',msg_payload,req,res);
	//} else {
	//	res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	//}	
}

function get_schedule(req,res){
	var month = req.params.month;
	var msg_payload = {
			"type":"getschedule",
			"GuardSSN":req.session.ssn,
			"month":month
	};
	utility.get_request('guard_queue',msg_payload,req,res);
}

function getAllGuardDetails(req,res){
	var msg_payload = {
			"type":"getallguards",
	};
	utility.get_request('guard_queue',msg_payload,req,res);
	
}

function getAllCheckpoints(req,res){
	var msg_payload = {
			"type":"getallcheckpoints"
	};
	utility.get_request('guard_queue',msg_payload,req,res);
}

function setGuardDetails(req,res){
//	if (utility.checkInt(req.param("guard_ssn"))
//			&& utility.checkInt(req.param("hours_worked"))
//			&& utility.checkString(req.param("background_status_check"))
//			&& utility.checkEmail(req.param("email_id"))
//			&& utility.checkString(req.param("password"))
//			&& utility.checkString(req.param("first_name"))
//			&& utility.checkString(req.param("last_name"))
//			&& utility.checkString(req.param("address"))
//			&& utility.checkString(req.param("city"))
//			&& utility.checkString(req.param("state"))
//			&& utility.checkInt(req.param("zipcode"))
//			&& utility.checkInt(req.param("phone_number"))
//			&& utility.checkString(req.param("query"))) {
	
	
		var msg_payload = { 
				"guard_ssn": req.param("guard_ssn"),
				"hours_worked": req.param("hours_worked"),
				"background_status_check": req.param("background_status_check"),
				"email_id":req.param("email_id"),
				"password":req.param("password"),
				"first_name":req.param("first_name"),
				"last_name":req.param("last_name"),
				"address":req.param("address"),
				"city":req.param("city"),
				"state":req.param("state"),
				"zipcode":req.param("zipcode"),
				"phone_number":req.param("phone_number"),
				"type":"setguard",
				"query":req.param("query")
			   };
		
		utility.send_request('guard_queue',msg_payload,req,res);
//	} else {
//		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
//	}
	
}

function setAlertDetails(req,res)
{
	if (utility.checkInt(req.param("alert_type_id"))
			&& utility.checkInt(req.param("alert_type"))) {
		var msg_payload = {
				"alert_id":req.param("alert_type_id"),
				"alert_type":req.param("alert_type"),
				"querytype":req.param("operation"),	
				"type":"setalert"
		};
		
		utility.send_request("guard_queue",msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}
}

function deleteGuardDetails (req, res) {
	if (utility.checkInt(req.param("guard_ssn"))) {
		var msg_payload = { 
				"guard_ssn": req.param("guard_ssn"),
				"type":"delete_guard"
			   };
		
		utility.send_request('guard_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}	
}

function delete_AlertType(req,res){
	if (utility.checkInt(req.param("alert_type_id"))) {
		var msg_payload = { 
				"alert_type_id": req.param("alert_type_id"),
				"type":"delete_alert"
			   };
		
		utility.send_request('guard_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}
	
}

function assignGuardToBuilding (req,res){
	console.log("reached here");
	//console.log(req.param("shiftguards"));
	
	var shiftguard = req.param("shiftguards");
	console.log(shiftguard.building_id);
	
	var msg_payload = {
			"shiftguards":req.param("shiftguards"),
		"type":"assignguard"	
	};
	
	utility.send_request('guard_queue',msg_payload,req,res);
	/*temp.forEach(function(object){
		console.log(object);
	});*/
	
	/*if (utility.checkInt(req.param("guard_ssn"))
			&& utility.checkInt(req.param("building_id"))
			&& utility.checkInt(req.param("shift_id"))
			&& utility.checkString(req.param("shift_name"))
			&& utility.checkDate(req.param("shift_from_date"))
			&& utility.checkDate(req.param("shift_to_date"))) {
		var msg_payload = {
				"guard_ssn":req.param("guard_ssn"),
				"building_id":req.param("building_id"),
				"shift_id":req.param("shift_id"),
				"shift_name":req.param("shift_name"),
				"shift_from_date":req.param("shift_from_date"),
				"shift_to_date":req.param("shift_to_date"),
				"type":"assignguard"
			};
			
			utility.send_request('guard_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}	*/
}

function getGuardLastLocation(req,res){
	
	var msg_payload = {
			"type":"guardlocation",
			"guardssn":req.param("guard_ssn")
	};
	utility.get_request('guard_queue',msg_payload,req,res);
}


exports.getGuardLastLocation = getGuardLastLocation;
exports.assignGuardToBuilding = assignGuardToBuilding;
exports.setAlertDetails = setAlertDetails;
exports.setGuardDetails = setGuardDetails;
exports.getAllCheckpoints = getAllCheckpoints;
exports.add_alert = add_alert;
exports.get_alert_types = get_alert_types;
exports.get_timeline_details = get_timeline_details;
exports.get_building_list = get_building_list;
exports.get_schedule = get_schedule;
exports.getAllGuardDetails = getAllGuardDetails;
exports.delete_Guard_Details = deleteGuardDetails;
exports.delete_AlertType  = delete_AlertType;