var mq_client = require('../../rpc/client');
var utility = require('./utility');


function get_All_Building_Details (req,res){
	console.log("Get all building Inside ");
	var msg_payload = {
			"type":"all_building_details",
	};
	utility.get_request('building_queue',msg_payload,req,res);
}

function setBuildingDetails (req,res){
	console.log("set building parameters" + req.param("operation"));
	if (utility.checkInt(req.param("buildingID"))
			&& utility.checkString(req.param("buildingName"))
			&& utility.checkInt(req.param("buildingZipcode"))
			&& utility.checkDate(req.param("buildingReleaseDate"))
			&& utility.checkInt(req.param("serviceFee"))
			&& utility.checkInt(req.param("personSSN"))
			&& utility.checkString(req.param("personName"))
			&& utility.checkEmail(req.param("emailID"))
			&& utility.checkInt(req.param("phoneNumber"))) {
			var msg_payload = {
				"buildingID": req.param("buildingID"),
				"buildingName": req.param("buildingName"),
				"buildingAddress": req.param("buildingAddress"),
				"buildingZipcode": req.param("buildingZipcode"),
				"buildingReleaseDate": req.param("buildingReleaseDate"),
				"serviceFee": req.param("serviceFee"),
				"personSSN": req.param("personSSN"),
				"personName": req.param("personName"),
				"emailID": req.param("emailID"),
				"phoneNumber": req.param("phoneNumber"),
				"querytype": req.param("operation"),
				"type":"setbuilding"
			};
			
			utility.get_request('building_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}
	
}

function deleteBuildingDetails (req, res) {
	console.log(req.param("building_id"));
	if (utility.checkInt(req.param("buildingID"))) {
		var msg_payload = { 
				"building_id": req.param("building_id"),
				"type":"delete_building"
			   };
		
		utility.send_request('building_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}	
}

function deleteCheckPoint (req, res) {
	if (utility.checkInt(req.param("checkpoint_id"))) {
		var msg_payload = { 
				"checkpoint_id": req.param("checkpoint_id"),
				"type":"delete_checkpoint"
			   };
		
		utility.send_request('building_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}	
}

function getTotalNumberOfBuldings (req, res) {
	var msg_payload = {
			"type" : "total_number_of_buildings"
	};
	utility.get_request('building_queue', msg_payload, req, res);
}

function getTotalNumberOfBuldingsForClient (req, res) {
	var msg_payload = {
			"client_ssn" : req.param("client_ssn"),
			"type" : "total_number_of_buildings"
	};
	utility.get_request('building_queue', msg_payload, req, res);
}

function getTotalRevenueForAllBuilding (req, res) {
	var msg_payload = {
			"type" : "total_revenue_of_all_buildings"
	};
	utility.get_request('building_queue', msg_payload, req, res);
}

function setCheckpointDetails(req,res){
	if (utility.checkInt(req.param("checkpoint_id"))
			&& utility.checkInt(req.param("building_id"))
			&& utility.checkString(req.param("latitude"))
			&& utility.checkString(req.param("longitude"))
			&& utility.checkString(req.param("checkpoint_name"))) {
		console.log(req.param("building_id"));
		var msg_payload = {
				"checkpoint_id": req.param("checkpoint_id"),
				"building_id" : req.param("building_id"),
				"latitude" : req.param("latitude"),
				"longitude" : req.param("longitude"),
				"checkpoint_name": req.param("checkpoint_name"),
				"querytype":req.param("operation"),
				"type":"setcheckpoint"
		};
		
		utility.get_request('building_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}	
}

function verify_client_before_add_building (req,res){
	var ssn = req.param("client_ssn");
	var correctedssn = ssn.replace(/-/g,"");
	if (utility.checkInt(correctedssn)) {
		//console.log(req.param("client_ssn"));
		var msg_payload = {
				"client_ssn":correctedssn,
				"type" : "verifyclient"
		};
		
		utility.get_request('building_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}		
}


function getBuildingGuards(req,res){
	if (utility.checkInt(req.param("building_id"))) {
		console.log("get Building Guards:" +req.param("building_id"));
		var msg_payload = {
				"building_id":req.param("building_id"),
				"type": "getGuards"
		};
		utility.get_request('building_queue',msg_payload,req,res);
	}else{
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});	
	}
}

exports.getBuildingGuards = getBuildingGuards;
exports.verify_client_before_add_building = verify_client_before_add_building;
exports.setCheckpointDetails = setCheckpointDetails;
exports.setBuildingDetails = setBuildingDetails;
exports.get_All_Building_Details = get_All_Building_Details;
exports.delete_Building_Details = deleteBuildingDetails;
exports.get_Total_Number_Of_Buildings = getTotalNumberOfBuldings;
exports.getTotalNumberOfBuldingsForClient = getTotalNumberOfBuldingsForClient;
exports.get_Total_Revenue_For_All_Building = getTotalRevenueForAllBuilding;
exports.delete_CheckPoint = deleteCheckPoint;