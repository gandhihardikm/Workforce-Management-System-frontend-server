/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , compression = require('compression')

  //Add Page Here ruotes
  , routes = require('./controllers/routes/index')
  , loginMediator = require('./controllers/makerequest/login')
  , guardMediator = require('./controllers/makerequest/guard_mediator')
  , clientMediator = require('./controllers/makerequest/client_mediator')
  , person_Info = require('./controllers/makerequest/person_Info')
  , building = require('./controllers/makerequest/building_mediator');

var apicache = require('apicache').options({ debug: true }).middleware;

var app = express();

// all environments
app.set('port', process.env.PORT || 3232);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(compression());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(session({
	store: new RedisStore({ // Session stored in redis
		  host:'127.0.0.1', // redis-server thats on localhost
		  port: 6379, // access on port
		  ttl: 60*1000 // in seconds
		}), 
	secret: 'CMPE273TEAM2' 
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/controllers',  express.static(__dirname + '/controllers'));
app.use('/views',  express.static(__dirname + '/views'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/assets',  express.static(__dirname + '/views/assets'));
app.use('/audio',  express.static(__dirname + '/views/audio'));
app.use('/images',  express.static(__dirname + '/views/images'));
app.use('/img',  express.static(__dirname + '/views/images/img'));
app.use(app.router);

// This is used to CORS issue. (Cross Browsing scripting Error) while handling two Node servers. 
// Note : Using RabbitMQ this error doesn't occur or wasn't discovered yet I've added this code for Future safety
app.use(function(req, res, next) {
	// Allow request coming from any origin, if you need any specific Originator, instead of '*' specify the required URI
	res.header('Access-Control-Allow-Origin', '*');
	// Specify allowed headers that you require, If you require to provide access any more header values specify here
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	// This is for sending cookie data with the request, as by default they're not sent and this value is set to false, for security reasons. Thus setting it to True explicitly
	res.header("Access-Control-Allow-Credentials", true);
	
	// Before any request is actually triggered, Chrome sends an dummy request as 'OPTIONS', thus this checks if our server will accept the headers and credentials with that type of request
	// on success response for this, Chrome sends the Original originated request. Thus used to counter it. 
	if (req.method === "OPTIONS") {
		res.end('');
	} else {
		next();
	}
});

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * This is used to restrict user if he is not authenticate, before trigerring the request.
 * @param req
 * @param res
 * @param next
 */
function restrict(req, res, next) {
console.log("token : "+req.session.token);
  if (req.session.token) { // If token is present authenticate user
	  console.log("User Ok");
	  next();
  } else { // Else send unauthorised access error
	console.log(".....401.....");
    req.session.error = 'Access denied!';
    res.end('401');
  }
}

// All get request defined here
//get Request
app.get('/', routes.index);
//get login page
app.get('/login', routes.login);
app.get('/error',routes.error);
app.get('/dashboard', routes.dashboard); 
app.get('/client_dashboard', routes.load);
app.get('/guard_dashboard', routes.guardPage);


//--- Guard start----- 
//guardMediator -> filename - guard_mediator
app.get('/guards',guardMediator.getAllGuardDetails);
app.get('/getalerttype',guardMediator.get_alert_types);
app.get('/getGuardTimelineDetail',guardMediator.get_timeline_details);
app.get('/getGetBuildingList',guardMediator.get_building_list);
app.get('/getSchedule/:month',guardMediator.get_schedule);

//--- Guard End -----
// Client
app.get('/clients', clientMediator.getAllClientDetails); // Vipul Kanade - 20-Apr-2015
app.get('/totalNumberOfClients', clientMediator.get_Total_Number_Of_Clients);
app.get('/totalNumberOfPendingClients', clientMediator.get_Total_Number_Of_Pending_Clients);
app.get('/getDonutData',clientMediator.getDonutData);
app.get('/getBarGraphData',apicache('5 minutes'),clientMediator.getBarGraphData);
app.get('/getTotalAlertCountPerClient',clientMediator.getTotalAlertCountPerClient);
app.get('/getTotalBuildingCountPerClient',clientMediator.getTotalBuildingCountPerClient);

app.get('/getCheckPointsForClient',clientMediator.getCheckPointsForClient);

// Alerts
app.get('/getAlertReport', clientMediator.getAlertReports);
app.get('/getTotalNumberOfAlerts', clientMediator.getTotalNumberOfAlerts);

// building
app.get('/getBuildingReport', clientMediator.getBuildingReports);
app.get('/getTotalRevenueDetails', building.get_Total_Revenue_For_All_Building);

app.get('/getDueDetails', clientMediator.getDueDetails);  
app.get('/getDailyReports', clientMediator.getDailyReports); 
app.get('/getAlertDashboardReports', clientMediator.getAlertDashBoardReports);

// Building
app.get('/getAllBuildingDetails', building.get_All_Building_Details);
app.get('/totalNumberBuildings', building.get_Total_Number_Of_Buildings);
app.get('/totalNumberBuildingsForClient', building.getTotalNumberOfBuldingsForClient);

app.get('/getPersonNameType', person_Info.getPersonNameTypeDetails);

app.get('/getBillReports',clientMediator.getBillReports);

app.get('/getcheckpoint',guardMediator.getAllCheckpoints);


// All post request defined here
// post login credentials for validation
app.post('/login', loginMediator.after_login);
app.post('/addalertdetail',guardMediator.add_alert);
app.post('/logout', loginMediator.logout);
app.post('/assignGuard',guardMediator.assignGuardToBuilding);
app.post('/getAlertReport', clientMediator.getAlertReports);

app.post('/getBuildingGuards',building.getBuildingGuards);
app.post('/getPatrolScheduleForReportSelected',clientMediator.getPatrolScheduleForReportSelected);
app.post('/getPatrolingReportDataForSelectedReport',clientMediator.getPatrolingReportDataForSelectedReport);
app.post('/getPatrolDataGuardComments',clientMediator.getPatrolDataGuardComments);
app.post('/verifyClient',building.verify_client_before_add_building);

// CLient
app.post('/client',clientMediator.setClientDetails);
app.post('/deleteClient',clientMediator.deleteClientDetails);


// Guard
app.post('/guard',guardMediator.setGuardDetails);
app.post('/deleteGuard',guardMediator.delete_Guard_Details);
app.post('/alerttype',guardMediator.setAlertDetails);
app.post('/getGuardLastLocation',guardMediator.getGuardLastLocation);


// Building
app.post('/building',building.setBuildingDetails);
app.post('/deleteBuilding',building.delete_Building_Details);
app.post('/deleteCheckpoint',building.delete_CheckPoint);
app.post('/deleteAlertType',guardMediator.delete_AlertType);

//Checkpoint
app.post('/checkpoint',building.setCheckpointDetails);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});