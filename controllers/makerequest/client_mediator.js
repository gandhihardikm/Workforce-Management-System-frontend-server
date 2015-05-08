var mq_client = require('../../rpc/client');
var utility = require('./utility');

function getAlertDashBoardReports(req, res) {
	
	var msg_payload = { "type":"get_Alert_Dashboard_request",
						"ssn": req.session.ssn};

	utility.get_request('reports_queue',msg_payload,req,res);
}

function getAlertReports(req, res) {
	var ssn;
	
	if(req.param("client_ssn"))
		ssn=req.param("client_ssn");
	else
		ssn=req.session.ssn;
	var msg_payload = { "type":"get_Alert_Details",
						"ssn": ssn};
	
	utility.get_request('reports_queue',msg_payload,req,res);
}

function getBuildingReports (req, res) {
	console.log("building");
	var msg_payload = { "type":"get_Building_Details", "ssn": req.session.ssn};
	
	utility.get_request('reports_queue',msg_payload,req,res);
}

function getDailyReports(req, res) {
	console.log("daily reports");
	var msg_payload = { "type":"get_Daily_Reports",
						"ssn": req.session.ssn};

	utility.get_request('reports_queue',msg_payload,req,res);
}

function getDueDetails(req, res) {
	console.log("dues");
	var msg_payload = { "type":"get_Dues",
						"ssn": req.session.ssn};
	
	utility.get_request('reports_queue', msg_payload, req, res);
}

function getAllClientDetails (req, res) {
	
	var msg_payload = { "type" : "get_All_Client_Details" };
	
	utility.get_request('client_request_queue', msg_payload, req, res);
}


function getBillReports(req, res) {
	console.log("bills");
	var msg_payload = { "type":"get_Bills",
						"ssn": req.session.ssn};
	
	utility.get_request('reports_queue', msg_payload, req, res);

};

function setClientDetails(req,res){
	
	console.log("come set client ");
	
	if(req.param("query") == 1)
	{
		console.log("update");
		if (utility.checkInt(req.param("client_ssn"))
				&& utility.checkInt(req.param("service_amount"))
				&& utility.checkInt(req.param("amount_paid"))
				&& utility.checkInt(req.param("amount_due"))
				&& utility.checkDate(req.param("contract_start_date"))
				&& utility.checkDate(req.param("contract_end_date"))
				&& utility.checkEmail(req.param("email_id"))
				&& utility.checkString(req.param("password"))
				&& utility.checkString(req.param("first_name"))
				&& utility.checkString(req.param("last_name"))
				&& utility.checkString(req.param("address"))
				&& utility.checkString(req.param("city"))
				&& utility.checkString(req.param("state"))
				&& utility.checkInt(req.param("zipcode"))) {
			var msg_payload = { 
					"client_ssn": req.param("client_ssn"),
					"service_amount": req.param("service_amount"),
					"amount_paid": req.param("amount_paid"),
					"amount_due": req.param("amount_due"),
					"contract_start_date": req.param("contract_start_date"),
					"contract_end_date": req.param("contract_end_date"),
					"email_id":req.param("email_id"),
					"password":req.param("password"),
					"first_name":req.param("first_name"),
					"last_name":req.param("last_name"),
					"address":req.param("address"),
					"city":req.param("city"),
					"state":req.param("state"),
					"zipcode":req.param("zipcode"),
					"phone_number":req.param("phone_number"),
				
					"query":req.param("query"),
					
					"type":"setclient"
				   };
			
			utility.send_request('client_request_queue',msg_payload,req,res);
		} else {
			res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
		}
		
	}
	else
	{
		console.log("Add");
		if (utility.checkInt(req.param("client_ssn"))
				&& utility.checkInt(req.param("service_amount"))
				&& utility.checkInt(req.param("amount_paid"))
				&& utility.checkInt(req.param("amount_due"))
				&& utility.checkDate(req.param("contract_start_date"))
				&& utility.checkDate(req.param("contract_end_date"))
				&& utility.checkEmail(req.param("email_id"))
				&& utility.checkString(req.param("password"))
				&& utility.checkString(req.param("first_name"))
				&& utility.checkString(req.param("last_name"))
				&& utility.checkString(req.param("address"))
				&& utility.checkString(req.param("city"))
				&& utility.checkString(req.param("state"))
				&& utility.checkInt(req.param("zipcode"))
				&& utility.checkInt(req.param("phone_number"))
				&& utility.checkString(req.param("buildingName"))
				&& utility.checkString(req.param("buildingAddress"))
				&& utility.checkInt(req.param("buildingZipcode"))
				&& utility.checkDate(req.param("buildingReleaseDate"))
				&& utility.checkInt(req.param("serviceFee"))
				&& utility.checkString(req.param("latitude"))
				&& utility.checkString(req.param("longitude"))
				&& utility.checkString(req.param("checkpoint_name"))) {
			var msg_payload = { 
					"client_ssn": req.param("client_ssn"),
					"service_amount": req.param("service_amount"),
					"amount_paid": req.param("amount_paid"),
					"amount_due": req.param("amount_due"),
					"contract_start_date": req.param("contract_start_date"),
					"contract_end_date": req.param("contract_end_date"),
					"email_id":req.param("email_id"),
					"password":req.param("password"),
					"first_name":req.param("first_name"),
					"last_name":req.param("last_name"),
					"address":req.param("address"),
					"city":req.param("city"),
					"state":req.param("state"),
					"zipcode":req.param("zipcode"),
					"phone_number":req.param("phone_number"),
					
					"building_Name": req.param("buildingName"),
					"building_Address": req.param("buildingAddress"),
					"building_Zipcodede": req.param("buildingZipcode"),
					"building_Releasedate": req.param("buildingReleaseDate"),
					"service_Fee": req.param("serviceFee"),
					
					"latitude" : req.param("latitude"),
					"longitude" : req.param("longitude"),
					"checkpoint_name": req.param("checkpoint_name"),
					
					"query":req.param("query"),
					
					"type":"setclient"
				   };
			
			utility.send_request('client_request_queue',msg_payload,req,res);
		} else {
			res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
		}
	}
}

function deleteClientDetails (req, res) {
	if (utility.checkInt(req.param("client_ssn"))) {
		var msg_payload = { 
				"client_ssn": req.param("client_ssn"),
				"type":"delete_client"
			   };
		
		utility.send_request('client_request_queue',msg_payload,req,res);
	} else {
		res.send({"value":"Fail", "status":false, "Message":"Please Enter appropriate values"});
	}
	
}

function getTotalNumberOfClients(req, res) {
	
	var msg_payload = { "type":"total_number_of_clients"};
	console.log("client");
	utility.get_request('client_request_queue',msg_payload,req,res);
}

function getTotalNumberOfAlerts(req, res) {
	
	var msg_payload = { "type":"total_number_of_alerts"};

	utility.get_request('client_request_queue',msg_payload,req,res);
}

function getTotalNumberOfPendingClients(req, res) {
	
	var msg_payload = { "type":"total_number_of_pending_clients"};

	utility.get_request('client_request_queue',msg_payload,req,res);
}

function getDonutData (req, res) {
    
    var msg_payload = { "type" : "get_Donut_Data",
                                            "ssn": req.session.ssn};
    
    utility.get_request('reports_queue', msg_payload, req, res);
}

function getBarGraphData (req, res) {
    console.log("donut inside");
    var msg_payload = { "type" : "get_Bar_Graph_Data",
                                            "ssn": req.session.ssn};
    
    utility.get_request('reports_queue', msg_payload, req, res);
}

function getTotalAlertCountPerClient (req, res) {
    console.log("getTotalAlertCountPerClient inside");
    var msg_payload = { "type" : "get_Total_Alert_Count_Per_Client",
                                            "ssn": req.session.ssn};
    
    utility.get_request('reports_queue', msg_payload, req, res);
}

function getTotalBuildingCountPerClient (req, res) {
    console.log("getTotalBuildingCountPerClient inside");
    var msg_payload = { "type" : "get_Total_Building_Count_Per_Client",
                                            "ssn": req.session.ssn};
    
    utility.get_request('reports_queue', msg_payload, req, res);
}

function getPatrolScheduleForReportSelected(req,res){
	console.log("234sdfffffddddd"+req.param("reportDate"));
	var msg_payload = {"reportDate":req.param("reportDate"),
			"buildingID":req.param("buildingID"),
			"type":"patrolreport"
		}
	
	utility.get_request('reports_queue',msg_payload,req,res);
}

function getPatrolingReportDataForSelectedReport(req,res){
	
	var msg_payload = {"reportDate":req.param("reportDate"),
			"buildingID":req.param("buildingID"),
			"clientSSN":req.session.ssn,
			"type":"patrolreportdata"
	}
	utility.get_request('reports_queue',msg_payload,req,res);
}

function getPatrolDataGuardComments (req,res){
	
	var msg_payload = {"reportDate":req.param("reportDate"),
			"buildingID":req.param("buildingID"),		
			"type":"patrolcomments"
	}
	
	utility.get_request('reports_queue',msg_payload,req,res);
}


function getCheckPointsForClient (req,res){
	
	var msg_payload = {"ssn": req.session.ssn,		
			"type":"checkpointsForClient"
	}
	
	utility.get_request('reports_queue',msg_payload,req,res);
}

exports.getCheckPointsForClient = getCheckPointsForClient;
exports.getPatrolDataGuardComments = getPatrolDataGuardComments;
exports.getPatrolingReportDataForSelectedReport = getPatrolingReportDataForSelectedReport;
exports.getPatrolScheduleForReportSelected = getPatrolScheduleForReportSelected;
exports.getTotalBuildingCountPerClient = getTotalBuildingCountPerClient;
exports.getTotalAlertCountPerClient = getTotalAlertCountPerClient;
exports.getBarGraphData = getBarGraphData;
exports.getDonutData = getDonutData;
exports.setClientDetails = setClientDetails;
exports.getBillReports = getBillReports;
exports.getAlertDashBoardReports =  getAlertDashBoardReports;
exports.getAlertReports = getAlertReports;
exports.getBuildingReports = getBuildingReports;
exports.getDailyReports = getDailyReports;
exports.getDueDetails = getDueDetails;
exports.getAllClientDetails = getAllClientDetails;
exports.deleteClientDetails = deleteClientDetails;
exports.get_Total_Number_Of_Clients = getTotalNumberOfClients;
exports.getTotalNumberOfAlerts = getTotalNumberOfAlerts;
exports.get_Total_Number_Of_Pending_Clients = getTotalNumberOfPendingClients;