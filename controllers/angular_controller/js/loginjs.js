var app = angular.module('myApp', []);
app.controller('loginController',function($scope,$http, $window){
	console.log(1);
	$scope.login = function() {
		
	    	$http({
	            method: 'POST',
	            url: '/login',
	            data: { "userssn": $scope.username, "password": $scope.password }

	        }).success(function(response){
	            console.log(JSON.stringify(response));

	            if(response.value === "Success") {
	            	//alert(response.login);
	            	if (response.login.user_type_id === 0) {
	            		//alert("Admin");
	            		$window.localStorage.userSSN = response.login.person_ssn;
	            		window.location = '/dashboard';
	            	} else if (response.login.user_type_id === 1) {
	            		//alert("Client");
	            		$window.localStorage.userSSN = response.login.person_ssn;
	            		window.location = '/client_dashboard';
	            	} else if (response.login.user_type_id === 2) {
	            		//alert("Gaurd");
	            		$window.localStorage.userSSN = response.login.person_ssn;
	            		window.location = '/guard_dashboard';
	            	}	            	
	            }  else{
	            	window.location = '/login';
	            	alert("Login Failed, Please Register or try again...!!");
	            }
	        }).error(function(error){

	            window.location = '/error';

	        });
	    };
});


/*
function LoginController($scope, $http, $location, $window, $cookies, $mdDialog) {
	if ($window.localStorage.token) {
		$window.location = '/successLogin';
	} else {
		$scope.login = function() {
			email = $scope.email;
			paswd = $scope.password;
			if (email && paswd) {
				var req = {
						method : 'POST',
						url : '/login',
						data : {
							"email" : email,
							"password" : paswd
						},
						withCredentials: true
					};
					
					$http(req).success(function(response) {
						if (response.status === true) {
							var d = new Date(response.lastlog);					
							$window.localStorage.token = response.token;
							$window.localStorage.lastLog = d;
							$window.localStorage.userID = response.userID;
							$window.location = '/successLogin';
						} else {
							$window.location = '/login';
						}	
					}).error(function(error) {
						alert("Error Logging In");
				});
			}
		};
	}
}

function signUpController($scope, $http, $location, $window, $cookies) {
	var firstName, lastName, emailID, password;
	if ($window.localStorage.token) {
		$window.location = '/successLogin';
	} else {
		$scope.signUpSubmit = function() {
			firstName = $scope.firstName;
			lastName = $scope.lastName;
			emailID =  $scope.newUserEmail;
			password = $scope.newUserPassword;
			
			if (firstName && lastName && emailID && password) {
				var req = {
						method : 'POST',
						url : '/signUp',
						data : {
							"name" : firstName + " " +lastName,
							"emailID": emailID,
							"password": password,
						},
						withCredentials: true
					};
				
				$http(req).success(function(response) {
					if (response.status === true) {
						if (response.userAlreadyPresent === true) {
							alert("Email-ID already signed up.\nPlease enter Different Email ID \nelse Login with existing Email ID");
						} else {
							alert("User Signed Up Successfull\nPlease Login to Proceed");
						}
					} else {
						alert("Issue in Sign Up");
					} 
					$window.location = '/login';	
				}).error(function(error) {
					alert("Error Signing Up");
				});
			}
		};
	}
}

linkedInApp.controller('signInController', LoginController).config( function($mdThemingProvider){
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('default');
  });
linkedInApp.controller('signUpController', signUpController);
*/