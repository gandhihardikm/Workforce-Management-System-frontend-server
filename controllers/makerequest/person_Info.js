var mq_client = require('../../rpc/client');
var utility = require('./utility');

function getPersonNameTypeDetails(req, res) {
	
	var msg_payload = { "type":"get_Person_Name_Type_Details",
						"ssn": req.session.ssn};
	
	utility.get_request('person_info_queue',msg_payload,req,res);

}

exports.getPersonNameTypeDetails =  getPersonNameTypeDetails;