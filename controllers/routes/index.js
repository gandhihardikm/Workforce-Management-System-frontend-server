var ejs = require("ejs");
function index(req, res){
	// Redirect Page To Login Page
	res.redirect('/login');
};

function login(req, res) {
	ejs.renderFile('./views/html/newLogin.html', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end("An error occured");
			console.log(err);
		}
	}) ;
};


//Dhvani Shah - 18-Apr-2015 - Dashboard page load - START
function dashboard(req, res){
	ejs.renderFile('./views/html/index.html', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end("An error occured");
			console.log(err);
		}
	}) ;
};
//Dhvani Shah - 18-Apr-2015 - Dashboard page load - END

function guardPage(req, res) {
	ejs.renderFile('./views/html/guard.html', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end("An error occured");
			console.log(err);
		}
	}) ;
};

function load(req, res) {
	ejs.renderFile('./views/html/clienthome.html', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end("An error occured");
			console.log(err);
		}
	}) ;
};

function error(req, res) {
	ejs.renderFile('./views/html/error.html', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end("An error occured");
			console.log(err);
		}
	}) ;
};

exports.error = error;
exports.index = index;
exports.login = login;
exports.dashboard = dashboard;
exports.guardPage = guardPage;
exports.load = load;
