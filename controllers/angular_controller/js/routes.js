'use strict';

//var guard_home_controller = require('./guard_home_controller');
var app = angular.module('workforce', ['ngRoute','ui.mask']).directive('ngOnkeyup', function() {
    return {
      restrict: 'A',
      scope: {
        func: '&ngOnkeyup'
      },
      link: function( scope, elem, attrs ) {
        elem.bind('keyup', scope.func);
      }
    };
  });

app.service('authenticationService',function($window){
	//alert("In Authentication Code..!!" + localStorage.getItem("userSSN"));
	if(localStorage.getItem("userSSN") == null || localStorage.getItem("userSSN") == 'undefined'){
		window.location = '/login';
	}
		
});

app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.href === '#collapseAddBuilding' || attrs.href === '#collapseAddCheckpoint'){
                elem.on('click', function(e){
                    e.preventDefault();
                    if(attrs.href === '#collapseAddBuilding')
                    	$("#collapseAddBuilding").collapse("toggle");
                    if(attrs.href === '#collapseAddCheckpoint')
                    	$("#collapseAddCheckpoint").collapse("toggle");
                });
            }
        }
   };
});

app.config(['$routeProvider',
            function($routeProvider,$locationProvider) {
				$routeProvider.
				when('/dashboard', {
					templateUrl: '../../../views/html/adminDashboard.html',
					controller: 'dashboardController'
     
				}).
				when('/logout', {
					//templateUrl: '../../../views/html/adminClient.html',
					controller: 'logoutController'
     
				}).
				when('/client', {
					templateUrl: '../../../views/html/adminClient.html',
					controller: 'clientController'
     
				}).
				when('/guard', {
					templateUrl: '../../../views/html/adminGuard.html',
					controller: 'guardController'
     
				}).
				when('/building', {
					templateUrl: '../../../views/html/adminBuilding.html',
					controller: 'buildingController'
     
				}).
				when('/alerttype', {
					templateUrl: '../../../views/html/adminAlertType.html',
					controller: 'alertTypeController'
     
				}).
				when('/checkpoint', {
					templateUrl: '../../../views/html/adminCheckpoint.html',
					controller: 'checkpointController'
				}).
				when('/alerts', {
					templateUrl: '../../../views/html/adminAllAlerts.html',
					controller: 'clientController'
					}).
                otherwise({
                  redirectTo: '/dashboard',
                });
              //$locationProvider.html5Mode(true);
          }
]);

//Datatables
var uiDatatable = function(){
    
    
    /*if($(".datatable_simple").length > 0){                
        $(".datatable_simple").dataTable({"ordering": false, "info": false, "lengthChange": false,"searching": false});
        $(".datatable_simple").on('page.dt',function () {
            onresize(100);
        });                
    } */           
}//END Datatable 


app.controller('dashboardController',function($scope,$http,$window,authenticationService){

	var now     = new Date();
    var hour    = now.getHours();
    var minutes = now.getMinutes();                    
    
    hour = hour < 10 ? '0'+hour : hour;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    
    $(".plugin-clock").html(hour+"<span>:</span>"+minutes);
   
	$http.get('/guards').success(function(response){
		var guardStr = response.resultsData;
		console.log(guardStr);
		$scope.guards = guardStr;
	 
		 angular.element(document).ready(function () {
			 
			 if($("#tblGuardList").length > 0){  
				 $('#tblGuardList').DataTable().search( $(this).val() ).draw();
			 }
		 });
			
	});
	
	var map;
	var myLatlng;
	function initialize(lat1,long1,title) {
		
		  myLatlng = new google.maps.LatLng(lat1,long1);
		  var mapOptions = {
		    zoom: 8,
		    center: myLatlng
		  };
		  
		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		  google.maps.event.addListenerOnce(map, 'idle', function() {
			   google.maps.event.trigger(map, 'resize');
			   map.setZoom(17);
			   map.setCenter(myLatlng);
		  });
		  var marker = new google.maps.Marker({
		      position: myLatlng,
		      map: map,
		      title: title
		  });
		}
	
	 $scope.viewGuardLocation = function(obj){
		
		 $http.post('/getGuardLastLocation',{"guard_ssn": obj.guard.guard_ssn}).success(function(response){
			 if(response.value == "Success"){
				
				angular.element(document).ready(function () {
					
					initialize(response.resultsData[0].latitude,response.resultsData[0].longitude,response.resultsData[0].guard_name);
					//google.maps.event.addDomListener(window, 'load', );
					//google.maps.event.trigger(map, "resize");
					google.maps.event.addListenerOnce(map, 'idle', function() {
						   google.maps.event.trigger(map, 'resize');
						   map.setZoom(17);
						   map.setCenter(myLatlng);
					});
					$(window).checkResize(function() {
					    // (the 'map' here is the result of the created 'var map = ...' above)
					    google.maps.event.trigger(map, "resize");
					  });
				});
			 }
			 else{
				 alert("Location not available at this moment");
				 $("#divViewGuardLocation").modal("hide");
			 }
		 });
			
		};
	
	$http.get("/totalNumberBuildings").success(function(response){
		console.log(response.resultsData[0].no_of_buildings);
		$("#number_of_buildings").html(response.resultsData[0].no_of_buildings);
		//console.log($scope.number_of_buildings);
	});
	
	$http.get("/getTotalNumberOfAlerts").success(function(response){
		console.log(response);
		$("#numberOfAlert").html(response.resultsData[0].numberOfAlert);
		//console.log($scope.number_of_buildings);
	});
	
	$http.get("/totalNumberOfClients").success(function(response){
		console.log("in total client");
		console.log(response);
		$("#numberOfClient").html(response.resultsData[0].numberOfClient);
		//console.log($scope.number_of_buildings);
	});
	
	$http.get("/getTotalRevenueDetails").success(function(response){
		console.log("in total revenue");
		console.log(response);
		$("#totalRevenue").html(response.resultsData[0].totalRevenue);
		//console.log($scope.number_of_buildings);
	});
	
	$http.get("/totalNumberOfPendingClients").success(function(response){
		console.log("in total pending");
		console.log(response);
		
		$("#totalNumberOfPendingClients").html(response.resultsData[0].totalPendingClient);
		//console.log($scope.number_of_buildings);
	});
	
	
});


app.controller('logoutController',function($scope,$http,$window,authenticationService){
	
	/*$http.post("/logout").success(function(response) {
		if(response.status) {
			$http.get("/");			
		}
	});*/

	
	$scope.logout = function(){
		//alert($scope.alert_description + " " + $scope.alert_date +  " "+$scope.alert_time);
		//console.log("here");
		
		var reqLogOut = {
				method : 'POST',
				url : '/logout',
				
			};
		$http(reqLogOut).success(function(response) {
			if (response.value === "Success") {	
				alert("Logged Out Successfully");
				$window.localStorage.clear();
				window.location="/login";			
			} else {
				alert("Signout not working.");
			}	
		}).error(function(error) {
			//alert("Error in handling logout details");
			window.location = '/error';
		});
	};
	
	
});

app.controller('clientController',function($scope,$http,authenticationService){
	
	$scope.states= [
	                  { name: 'ALABAMA', abbreviation: 'AL'},
	                  { name: 'ALASKA', abbreviation: 'AK'},
	                  { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
	                  { name: 'ARIZONA', abbreviation: 'AZ'},
	                  { name: 'ARKANSAS', abbreviation: 'AR'},
	                  { name: 'CALIFORNIA', abbreviation: 'CA'},
	                  { name: 'COLORADO', abbreviation: 'CO'},
	                  { name: 'CONNECTICUT', abbreviation: 'CT'},
	                  { name: 'DELAWARE', abbreviation: 'DE'},
	                  { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
	                  { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
	                  { name: 'FLORIDA', abbreviation: 'FL'},
	                  { name: 'GEORGIA', abbreviation: 'GA'},
	                  { name: 'GUAM', abbreviation: 'GU'},
	                  { name: 'HAWAII', abbreviation: 'HI'},
	                  { name: 'IDAHO', abbreviation: 'ID'},
	                  { name: 'ILLINOIS', abbreviation: 'IL'},
	                  { name: 'INDIANA', abbreviation: 'IN'},
	                  { name: 'IOWA', abbreviation: 'IA'},
	                  { name: 'KANSAS', abbreviation: 'KS'},
	                  { name: 'KENTUCKY', abbreviation: 'KY'},
	                  { name: 'LOUISIANA', abbreviation: 'LA'},
	                  { name: 'MAINE', abbreviation: 'ME'},
	                  { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
	                  { name: 'MARYLAND', abbreviation: 'MD'},
	                  { name: 'MASSACHUSETTS', abbreviation: 'MA'},
	                  { name: 'MICHIGAN', abbreviation: 'MI'},
	                  { name: 'MINNESOTA', abbreviation: 'MN'},
	                  { name: 'MISSISSIPPI', abbreviation: 'MS'},
	                  { name: 'MISSOURI', abbreviation: 'MO'},
	                  { name: 'MONTANA', abbreviation: 'MT'},
	                  { name: 'NEBRASKA', abbreviation: 'NE'},
	                  { name: 'NEVADA', abbreviation: 'NV'},
	                  { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
	                  { name: 'NEW JERSEY', abbreviation: 'NJ'},
	                  { name: 'NEW MEXICO', abbreviation: 'NM'},
	                  { name: 'NEW YORK', abbreviation: 'NY'},
	                  { name: 'NORTH CAROLINA', abbreviation: 'NC'},
	                  { name: 'NORTH DAKOTA', abbreviation: 'ND'},
	                  { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
	                  { name: 'OHIO', abbreviation: 'OH'},
	                  { name: 'OKLAHOMA', abbreviation: 'OK'},
	                  { name: 'OREGON', abbreviation: 'OR'},
	                  { name: 'PALAU', abbreviation: 'PW'},
	                  { name: 'PENNSYLVANIA', abbreviation: 'PA'},
	                  { name: 'PUERTO RICO', abbreviation: 'PR'},
	                  { name: 'RHODE ISLAND', abbreviation: 'RI'},
	                  { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
	                  { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
	                  { name: 'TENNESSEE', abbreviation: 'TN'},
	                  { name: 'TEXAS', abbreviation: 'TX'},
	                  { name: 'UTAH', abbreviation: 'UT'},
	                  { name: 'VERMONT', abbreviation: 'VT'},
	                  { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
	                  { name: 'VIRGINIA', abbreviation: 'VA'},
	                  { name: 'WASHINGTON', abbreviation: 'WA'},
	                  { name: 'WEST VIRGINIA', abbreviation: 'WV'},
	                  { name: 'WISCONSIN', abbreviation: 'WI'},
	                  { name: 'WYOMING', abbreviation: 'WY' }
	              ];
	
	$http.get("/clients").success(function(response){	
		//console.log(response.AllClientDetails);
		var clientStr = response.resultsData;
		$scope.clients = clientStr;
		//return false;
		 
		 angular.element(document).ready(function () {
			 
			 if($("#tblClientList").length > 0){  
				 $('#tblClientList').DataTable().search( $(this).val() ).draw();
			 }
		 });	
	});
	
	
	$scope.getAlerts = function(obj) {
		//console.log("obj is...");
		//console.log(obj);
		$scope.alertlist = {};
		$http({
			method : 'POST',
			url : '/getAlertReport',
			data: {"client_ssn":obj.client.client_ssn}
		}).success(function(response) {
			
			//console.log("success");
			if(response.value==="Success"){
				$scope.alertlist = response.resultsData;
			}
		}).error(function(error) {
			window.location = '/error';
			//console.log("error");
		});
	};
	
	 $scope.cancelClient = function() {
		 document.getElementById("frmClientAddEdit").reset(); 
	 };
	 
	$scope.addClient = function(){
		 $scope.editClientObj = {
				 					 "client_id":null,
				 					 "client_ssn":null,
				 					 "service_amount":null,
				 					 "amount_paid":null,
				 					 "amount_due":null,
				 					 "contract_start_date":null,
				 					 "contract_end_date":null,
					                 "first_name":null,
					                 "last_name":null,
					                 "email_id":null,
					                 "address":null,
					                 "city":null,
					                 "state":null,
					                 "zipcode":null,
					                 "phone_number":null,
					                 "operation":0
					             };
		 $(".datepicker").datepicker({format: 'yyyy-mm-dd'});
	};
	
	$scope.generateClientBill = function(obj) {
		//
		$scope.editClientObj = obj.client;
	};
	
	$scope.editClient = function(obj) {
		//
		$scope.editClientObj = obj.client;
		$scope.editClientObj.operation= 1;
	
		 if($(".datepicker").length > 0){
			 console.log("test");
             $(".datepicker").datepicker({format: 'yyyy-mm-dd'});                
             $("#dp-2,#dp-3,#dp-4").datepicker(); // Sample
         } 
		 var jvalidate = $("#frmClientAddEdit").validate({
             ignore: [],
             rules: {                                            
            	 	txtContractStartDate: {
                             required: true,
                             date: true
                     },
                     txtContractEndDate: { 
                    	 	required: true,
                         	date: true,
                    	 greaterThan: "#txtContractStartDate" 
                     },
                     txtPassword:{
                     	required: true
                        },
                     txtConfirmPassword:{
                     	equalTo: "#txtPassword"
                        },
                     txtClientEmail: { 
                 	 	required: true,
                      	email: true, 
                     },
                     txtPhoneNumber: { 
                  	 	required: true,
                  	 	number: true, 
                      },
                      txtZipcode: { 
                    	  required: true,
                    	    digits: true,
                    	    minlength: 5,
                    	    maxlength: 5
                     },
                     txtSSN : { 
                 	 	required: true,
                     	number: true,
                     },
                     txtAmountPaid: { 
                     	number: true,
                     },
                     txtAmountDue: { 
                     	number: true,
                     }
                 }
             }); 
		
	};
	$scope.saveClient = function() {
		
		console.log($(".ng-invalid"));
		//alert($(".ng-invalid").length);
		//alert($("#txtContractStartDate").val());
		if($(".ng-invalid").length == 0){
			$scope.editClientObj.contract_start_date = $("#txtContractStartDate").val();
			$scope.editClientObj.contract_end_date = $("#txtContractEndDate").val();
			$http.post('/client',{
					//client_id: $scope.editClientObj.client_id,				
					client_ssn: $scope.editClientObj.client_ssn,
					
					service_amount: $scope.editClientObj.service_amount,
					amount_paid: $scope.editClientObj.amount_paid,
					amount_due: $scope.editClientObj.amount_due,
					contract_start_date: $scope.editClientObj.contract_start_date,
					contract_end_date: $scope.editClientObj.contract_end_date,
					
					email_id: $scope.editClientObj.email_id,
					password: $scope.editClientObj.password,
					first_name: $scope.editClientObj.first_name,
					last_name: $scope.editClientObj.last_name,
					address: $scope.editClientObj.address,
					city: $scope.editClientObj.city,
					state: $scope.editClientObj.state,
					zipcode: $scope.editClientObj.zipcode,
					phone_number: $scope.editClientObj.phone_number,
					
					
					buildingName: $scope.editClientObj.buildingName,
					buildingAddress: $scope.editClientObj.buildingAddress,
					buildingZipcode: $scope.editClientObj.buildingZipcode,
					buildingReleaseDate: $scope.editClientObj.buildingReleaseDate,
					serviceFee: $scope.editClientObj.serviceFee,
					
					latitude: $scope.editClientObj.latitude,
					longitude: $scope.editClientObj.longitude,
					checkpoint_name: $scope.editClientObj.checkpoint_name,	
					
					query: $scope.editClientObj.operation,
			})
			.success(function(response){
				if(response.value == "Success"){
					$('#divEditClient').modal('hide');
					
					if($scope.editClientObj.operation == 0)
						$scope.clients.push($scope.editClientObj);
				}
				else{
					alert(response.Message);
				}
				
			}).error(function(error) {
				window.location = '/error';
				//alert("Error in handling details");
			});
			
		}
		
	};
	
	$scope.confirmDeleteClient = function(obj) {
		$scope.deleteClientObj = obj.client;
		$("#mb-clientdelete").toggleClass("open");
	};
	
	$scope.cancelDeleteClient = function() {
		$("#mb-clientdelete").removeClass("open");
		return false;
	};
	
	$scope.deleteClient = function(person_ssn) {

		$http.post('/deleteClient', {"client_ssn": person_ssn}).
		  success(function(data, status, headers, config) {
			  angular.forEach($scope.clients, function(value, key) {
				  if(value.person_ssn == person_ssn){
					  console.log("key:: "+key);
					  delete $scope.clients[key];
					  $scope.clients.splice(key,1);
				  }
			});
			
			$("#mb-clientdelete").removeClass("open");
			
			alert("Record Deleted Successfully");
			return false;	 
		}).
		error(function(data, status, headers, config) {
			window.location = '/error';
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	};
});
app.controller('guardController', function($scope,$http,authenticationService){
	
	$scope.states= [
	                  { name: 'ALABAMA', abbreviation: 'AL'},
	                  { name: 'ALASKA', abbreviation: 'AK'},
	                  { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
	                  { name: 'ARIZONA', abbreviation: 'AZ'},
	                  { name: 'ARKANSAS', abbreviation: 'AR'},
	                  { name: 'CALIFORNIA', abbreviation: 'CA'},
	                  { name: 'COLORADO', abbreviation: 'CO'},
	                  { name: 'CONNECTICUT', abbreviation: 'CT'},
	                  { name: 'DELAWARE', abbreviation: 'DE'},
	                  { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
	                  { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
	                  { name: 'FLORIDA', abbreviation: 'FL'},
	                  { name: 'GEORGIA', abbreviation: 'GA'},
	                  { name: 'GUAM', abbreviation: 'GU'},
	                  { name: 'HAWAII', abbreviation: 'HI'},
	                  { name: 'IDAHO', abbreviation: 'ID'},
	                  { name: 'ILLINOIS', abbreviation: 'IL'},
	                  { name: 'INDIANA', abbreviation: 'IN'},
	                  { name: 'IOWA', abbreviation: 'IA'},
	                  { name: 'KANSAS', abbreviation: 'KS'},
	                  { name: 'KENTUCKY', abbreviation: 'KY'},
	                  { name: 'LOUISIANA', abbreviation: 'LA'},
	                  { name: 'MAINE', abbreviation: 'ME'},
	                  { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
	                  { name: 'MARYLAND', abbreviation: 'MD'},
	                  { name: 'MASSACHUSETTS', abbreviation: 'MA'},
	                  { name: 'MICHIGAN', abbreviation: 'MI'},
	                  { name: 'MINNESOTA', abbreviation: 'MN'},
	                  { name: 'MISSISSIPPI', abbreviation: 'MS'},
	                  { name: 'MISSOURI', abbreviation: 'MO'},
	                  { name: 'MONTANA', abbreviation: 'MT'},
	                  { name: 'NEBRASKA', abbreviation: 'NE'},
	                  { name: 'NEVADA', abbreviation: 'NV'},
	                  { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
	                  { name: 'NEW JERSEY', abbreviation: 'NJ'},
	                  { name: 'NEW MEXICO', abbreviation: 'NM'},
	                  { name: 'NEW YORK', abbreviation: 'NY'},
	                  { name: 'NORTH CAROLINA', abbreviation: 'NC'},
	                  { name: 'NORTH DAKOTA', abbreviation: 'ND'},
	                  { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
	                  { name: 'OHIO', abbreviation: 'OH'},
	                  { name: 'OKLAHOMA', abbreviation: 'OK'},
	                  { name: 'OREGON', abbreviation: 'OR'},
	                  { name: 'PALAU', abbreviation: 'PW'},
	                  { name: 'PENNSYLVANIA', abbreviation: 'PA'},
	                  { name: 'PUERTO RICO', abbreviation: 'PR'},
	                  { name: 'RHODE ISLAND', abbreviation: 'RI'},
	                  { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
	                  { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
	                  { name: 'TENNESSEE', abbreviation: 'TN'},
	                  { name: 'TEXAS', abbreviation: 'TX'},
	                  { name: 'UTAH', abbreviation: 'UT'},
	                  { name: 'VERMONT', abbreviation: 'VT'},
	                  { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
	                  { name: 'VIRGINIA', abbreviation: 'VA'},
	                  { name: 'WASHINGTON', abbreviation: 'WA'},
	                  { name: 'WEST VIRGINIA', abbreviation: 'WV'},
	                  { name: 'WISCONSIN', abbreviation: 'WI'},
	                  { name: 'WYOMING', abbreviation: 'WY' }
	              ];
	
	$http.get('/guards').success(function(response){
		var guardStr = response.resultsData;
		console.log(guardStr);
		$scope.guards = guardStr;
	 
		 angular.element(document).ready(function () {
			 
			 if($("#tblGuardList").length > 0){  
				 $('#tblGuardList').DataTable().search( $(this).val() ).draw();
			 }
		 });
			
	});
	
	 $scope.cancelGuard = function() {
		 document.getElementById("frmGuardAddEdit").reset(); 
	 };
	 
	
	$scope.addGuard = function(){
		
		var jvalidate = $("#frmGuardAddEdit").validate({
            ignore: [],
            rules: {                                            
            	txtFirstName: {
                            required: true,
                            number: false
                            
                    },
                    txtLastName: { 
                   	 	required: true,
                   	 number: false
                   	 	
                    },
                    txtAddress: { 
                	 	required: true,
                	 	number: false
                    },
                    txtCity: { 
                 	 	required: true,
                 	 	number: false
                     },
                     txtState: { 
                   	  required: true,
                   	number: false
                    },
                    txtZipcode : { 
                	 	required: true,
                    	//number: true
                    },
                    txtPhoneNumber: { 
                    	//number: true
                    },
                    txtSSN: { 
                    	//number: true
                    },
                    txtBackgroundStatusCheck: { 
                    	required: true
                    },
                    txtGuardEmail: { 
                    	email: true
                    },
                    txtPassword:{
                    	required: true
                       },
                    txtConfirmPassword:{
                    	equalTo: "#txtPassword"
                       }
                    
                }
            }); 
		
		
		$("#frmGuardAddEdit").validate();
		 $scope.editGuardObj = {
                 "guard_ssn":null,
                 "email_id":null,
                 "password":null,
                 "first_name":null,
                 "last_name":null,
                 "address":null,
                 "city":null,
                 "state":null,
                 "zipcode":null,
                 "phone_number":null,
                 "creation_date":null,
                 "updation_date":null,
                 "hours_worked" : null,
                 "building_id" : null,
                 "background_status_check" : null,
                 "shift_id" : null,
                 "operation" : 0,
             };
	};
	
	$scope.editGuard = function(obj) {
		//
		$scope.editGuardObj = obj.guard;
		$scope.editGuardObj.operation = 1;
		 if($(".datepicker").length > 0){
             $(".datepicker").datepicker({format: 'yyyy-mm-dd'});                
             $("#dp-2,#dp-3,#dp-4").datepicker(); // Sample
         } 
		 var jvalidate = $("#frmGuardAddEdit").validate({
             ignore: [],
             rules: {                                            
            	 	txtContractStartDate: {
                             required: true,
                             date: true
                     },
                     txtContractEndDate: { 
                    	 	required: true,
                         	date: true,
                    	 	//greaterThan: "#txtContractStartDate" 
                     },
                     txtClientEmail: { 
                 	 	required: true,
                      	email: true, 
                     },
                     txtPhoneNumber: { 
                  	 	required: true,
                      },
                      txtZipcode: { 
                    	  required: true,
                    	    minlength: 5,
                    	    maxlength: 5
                     },
                     txtSSN : { 
                 	 	required: true,
                     },
                     txtAmountPaid: { 
                     	number: true,
                     },
                     txtAmountDue: { 
                     	number: true,
                     }
                 }
             }); 
		 
		
	};
	
	var map;
	var myLatlng;
	function initialize(lat1,long1,title) {
		
		  myLatlng = new google.maps.LatLng(lat1,long1);
		  var mapOptions = {
		    zoom: 8,
		    center: myLatlng
		  };
		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		  google.maps.event.addListenerOnce(map, 'idle', function() {
			   google.maps.event.trigger(map, 'resize');
			   map.setZoom(17);
			   map.setCenter(myLatlng);
			});
		  var marker = new google.maps.Marker({
		      position: myLatlng,
		      map: map,
		      title: title
		  });
		}
	
	 $scope.viewGuardLocation = function(obj){
		
		 $http.post('/getGuardLastLocation',{"guard_ssn": obj.guard.guard_ssn}).success(function(response){
			 if(response.value == "Success"){
				
				angular.element(document).ready(function () {
					
					initialize(response.resultsData[0].latitude,response.resultsData[0].longitude,response.resultsData[0].guard_name);
					google.maps.event.addListenerOnce(map, 'idle', function() {
						   google.maps.event.trigger(map, 'resize');
						   map.setZoom(17);
						   map.setCenter(myLatlng);
					});
					//google.maps.event.addDomListener(window, 'load', );
					$(window).resize(function() {
					    // (the 'map' here is the result of the created 'var map = ...' above)
					    google.maps.event.trigger(map, 'resize');
					    map.setCenter(myLatlng);
					  });
				});
			 }
			 else{
				 
				 alert("Guard location not available at this time");
				 $("#divViewGuardLocation").modal("hide");
				 
			 }
		 });
			
	};
	$scope.saveGuard = function() {
		console.log($scope);
		//alert("invalid: "+$(".ng-invalid").length);
		
		console.log($(".ng-dirty").length);
		//return fasle;
		if($(".ng-invalid").length == 0){
			//alert("valid");
			$scope.editGuardObj.contract_start_date = $("#txtContractStartDate").val();
			$scope.editGuardObj.contract_end_date = $("#txtContractEndDate").val();
			$http.post('/guard',{
					guard_ssn: $scope.editGuardObj.guard_ssn,
					email_id: $scope.editGuardObj.email_id,
					password:  $scope.editGuardObj.password,
					first_name:  $scope.editGuardObj.first_name,
					last_name:  $scope.editGuardObj.last_name,
					address:  $scope.editGuardObj.address,
					city:  $scope.editGuardObj.city,
					state:  $scope.editGuardObj.state,
					zipcode:  $scope.editGuardObj.zipcode,
					phone_number:  $scope.editGuardObj.phone_number,
					hours_worked:  $scope.editGuardObj.hours_worked,
					//building_id:  $scope.editGuardObj.building_id,
					//building:  $scope.editGuardObj.building,
					background_status_check: $scope.editGuardObj.background_status_check,
					//shift_id: $scope.editGuardObj.shift_id,
					query: $scope.editGuardObj.operation,
			})
			.success(function(response){
				$('#divEditGuard').modal('hide');
			});
		}
		else{
			//window.location = '/error';
			//alert("invalid");
			return false;
		//if($(".error:visible").length == 0){
        }
		
	};
	$scope.confirmDeleteGuard = function(obj) {
		$scope.deleteGuardObj = obj.guard;
		$("#mb-Guarddelete").toggleClass("open");
	};
	
	$scope.cancelDeleteClient = function() {
		$("#mb-Guarddelete").removeClass("open");
		return false;
	};
	
	$scope.deleteGuard = function(guard_ssn) {
		
		$http.post('/deleteGuard', {"guard_ssn": guard_ssn}).
		  success(function(data, status, headers, config) {
			  angular.forEach($scope.guards, function(value, key) {
				  if(value.guard_ssn == guard_ssn){
					  console.log("key:: "+key);
					  delete $scope.guards[key];
					  $scope.guards.splice(key,1);
				  }
			});
			
			$("#mb-Guarddelete").removeClass("open");
			
			alert("Record Deleted Successfully");
			return false;
			 
		}).
		error(function(data, status, headers, config) {
			window.location = '/error';
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	};
});
app.controller('buildingController', function($scope,$http,authenticationService){
	$http.get("/getAllBuildingDetails").success(function(response){
		$scope.buildings = response.resultsData;//buildingStr;
		 
		 angular.element(document).ready(function () {
			 
			 if($("#tblBuildingList").length > 0){  
				 $('#tblBuildingList').DataTable().search( $(this).val() ).draw();
			 }
		 });	
	}); 
	
	
	 $scope.cancelBuilding = function() {
		 document.getElementById("frmBuildingAddEdit").reset(); 
	 };
	
		 $scope.editBuildingObj = {
					                 "buildingID":null,
					                 "buildingName":null,
					                 "buildingAddress":null,
					                 "buildingZipcode":null,
					                 "buildingReleaseDate":null,
					                 "serviceFee":null,
					                 "archiveStatus":null,
					                 "person_ssn":null,
					                 "personName":null,
					                 "emailID":null,
					                 "phoneNumber":null,
					                 "operation":0
					             };
	
	
	$scope.editBuilding = function(obj) {
		$scope.editBuildingObj = obj.building;
		$scope.editBuildingObj.operation = 1;
		
		 if($(".datepicker").length > 0){
             $(".datepicker").datepicker({format: 'yyyy-mm-dd'});                
             $("#dp-2,#dp-3,#dp-4").datepicker(); // Sample
         } 
		 $("#frmBuildingAddEdit").validate(); 
		
	};
	
	var guardCnt = 1;
	var tempshimpftguard = {"guard_ssn":guardCnt,"guard_name":"test1","shift_id":"1","shift_type":"Swing","shift_from_date":"","shift_to_date":""};
	$scope.editBuildingObj.tempshimpftguard = tempshimpftguard;
	
	
	
	$scope.shifts = [{"shift_id":"1","shift_type":"Morning"},{"shift_id":"2","shift_type":"Swing"},{"shift_id":"3","shift_type":"Night"}];
	//$scope.allguards = [{"guard_ssn":456,"email_id":"guard@mail.com","password":"456","first_name":"Guard","last_name":"Guard","address":null,"city":null,"state":null,"zipcode":null,"phone_number":null,"creation_id":null,"updation_id":null,"hours_worked":10,"background_status_check":null},{"guard_ssn":654,"email_id":"guard@guard.com","password":"654","first_name":"Guard 1","last_name":"Guard 11","address":null,"city":null,"state":null,"zipcode":null,"phone_number":null,"creation_id":null,"updation_id":null,"hours_worked":10,"background_status_check":null}];
	
	$scope.assignGuard = function(obj) {
		$scope.editBuildingObj = obj.building;
		$http.post('/getBuildingGuards', {"building_id": obj.building.buildingID}).
		  success(function(data, status, headers, config) {
			  if(data.value == "Success"){
				  var shiftguardStr = data.resultsData;
					 // var shiftguardStr = [{"guard_ssn":456,"guard_name":"test1","shift_id":"1","shift_type":"Swing","shift_from_date":"","shift_to_date":""},{"guard_ssn":"111","guard_name":"test2","shift_id":"1","shift_type":"Swing","shift_from_date":"","shift_to_date":""}];
						//alert(shiftguardStr);
					  $scope.editBuildingObj.shiftguards = shiftguardStr;
						$scope.editBuildingObj.tempshiftguards = [];
						
						angular.element(document).ready(function () {
							 if($(".datepicker").length > 0){
						            $(".datepicker").datepicker({format: 'yyyy-mm-dd'}); 
						     } 
							 $("#frmAssignGuard").validate();
						});
			  }
			  else
				  {
				  $scope.editBuildingObj.shiftguards = [];
				  $scope.editBuildingObj.tempshiftguards = [];
				  
				  }
			  
		});
	};
	
	$scope.addGuard = function() {
		console.log($scope.editBuildingObj.shiftguards);
		guardCnt++;
		tempshimpftguard = {"building_id":$scope.editBuildingObj.buildingID,"guard_ssn":"","guard_name":"","shift_id":"1","shift_type":"Swing","shift_from_date":"","shift_to_date":""};
		$scope.editBuildingObj.tempshiftguards.push(tempshimpftguard);
		
		angular.element(document).ready(function () {
			 if($(".datepicker").length > 0){
		            $(".datepicker").datepicker({format: 'yyyy-mm-dd'}); 
		     } 
		 });
		//$( "#guard_1" ).clone().appendTo( "#content" ).attr({"id":"guard_"+guardCnt}).css({"visibility":"visible"});
	};
	
	$scope.cancelGuard = function(obj) {
		if($scope.editBuildingObj.tempshiftguards.length == 1 && $scope.editBuildingObj.shiftguards.length == 0)
		{
			alert("Cannot delete record. Atleast one guard is required for each building");
			return false;
		}
		else{
			var del_ssn = obj.shiftguard.guard_ssn;
			
			angular.forEach($scope.editBuildingObj.tempshiftguards, function(value, key) {
				  if(value.guard_ssn == del_ssn){
					  delete $scope.editBuildingObj.tempshiftguards[key];
					  $scope.editBuildingObj.tempshiftguards.splice(key,1);
				  }
			});
		}
	};
	
	$scope.saveBuildingShift = function(){
		
		$http.post('/assignGuard', {"shiftguards": $scope.editBuildingObj.tempshiftguards}).
		  success(function(data, status, headers, config) {
			 if(data.value == "Success"){
			 	$("#divAssignGuard").dismiss("modal");
			 }
		});
		
	};
	
	$scope.saveBuilding = function() {	
		console.log($scope.editBuildingObj);
			if($(".ng-invalid").length == 0){
				$scope.editBuildingObj.contract_start_date = $("#txtContractStartDate").val();
				$scope.editBuildingObj.contract_end_date = $("#txtContractEndDate").val();
				
				if($scope.editBuildingObj.operation == 0)
					var pssn = $scope.editBuildingObj.client_ssn;
				else
					var pssn = $scope.editBuildingObj.personSSN;
				
				
				console.log($scope.editBuildingObj);
				$http.post('/building',{
					buildingID: $scope.editBuildingObj.buildingID,
					buildingName: $scope.editBuildingObj.buildingName,
					buildingAddress: $scope.editBuildingObj.buildingAddress,
					buildingZipcode: $scope.editBuildingObj.buildingZipcode,
					buildingReleaseDate: $scope.editBuildingObj.buildingReleaseDate,
					serviceFee: $scope.editBuildingObj.serviceFee,			
					personSSN: pssn,
					personName: $scope.editBuildingObj.personName,
					emailID: $scope.editBuildingObj.emailID,
					phoneNumber: $scope.editBuildingObj.phoneNumber,
					operation : $scope.editBuildingObj.operation,
				}).success(function(response){
					if(response.value=="Success")
						$('#divEditBuilding').modal('hide');
					else
						alert(response.Message);
				});

			}
			
		
	};
	
	$scope.viewCheckClient = function(){
		$("#errMsg").val("").hide();
		//$("#frmCheckClientSSN").validate();
	}
	$scope.checkPersonSSN = function(){
		
		
		 $scope.editBuildingObj = { "client_ssn": $("#txtClientSSN").val() };
		
		 if($("#txtClientSSN").val() == ""){
			 alert("Enter Client SSN");
		 }
		 else{
			 console.log($scope.editBuildingObj.client_ssn);
				
				$http.post('/verifyClient', {"client_ssn": $scope.editBuildingObj.client_ssn}).
				success(function(data, status, headers, config) {
					if(data.value == "Success"){
						$("#divPromptClientSSN").modal("hide");
						$scope.editBuildingObj = data.resultsData[0];
						console.log($scope.editBuildingObj);
						 $scope.editBuildingObj.operation = 0;
						$("#divEditBuilding").modal("show");
					}
					else{
						//alert(data.value);
						//$("#errMsg").val(data.value).show();
						return false;
					}
				});
		 }
		 
		 
		
	};
		$scope.confirmDeleteBuilding = function(obj) {
			$scope.deleteBuildingObj = obj.building;
			$("#mb-Buildingdelete").toggleClass("open");
		};
		
		$scope.cancelDeleteBuilding = function() {
			$("#mb-Buildingdelete").removeClass("open");
			return false;
		};
		
		$scope.deleteBuilding = function(building_id) {
			
			$http.post('/deleteBuilding', {"building_id": building_id}).
			  success(function(data, status, headers, config) {
				  angular.forEach($scope.buildings, function(value, key) {
					  if(value.buildingID == building_id){
						  console.log("key:: "+key);
						  delete $scope.buildings[key];
						  $scope.buildings.splice(key,1);
					  }
				});
				
				$("#mb-Buildingdelete").removeClass("open");
				
				alert("Record Deleted Successfully");
				return false;
				 
			}).
			error(function(data, status, headers, config) {
				window.location = '/error';
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
		};	
});
app.controller('alertTypeController',function($scope,$http,authenticationService){
	
	$http.get("/getalerttype").success(function(response){
		$scope.alerttypes = response.resultsData;
		 
		 angular.element(document).ready(function () {
			 
			 if($("#tblAlertTypeList").length > 0){  
				 $('#tblAlertTypeList').DataTable().search( $(this).val() ).draw();
			 }
		 });
			
	});
	
	
	 $scope.cancelAlertType = function() {
		 document.getElementById("frmAlertTypeAddEdit").reset(); 
	 };
	 
	$scope.addAlertType = function(){
		 $scope.editAlertTypeObj = {"alert_type_id":0,
				 "alert_type":null,
				 "operation":0
					 };
	};
	
	$scope.editAlertType = function(obj) {
		//$scope.editAlertTypeObj = obj.alert_type_id;
		$scope.editAlertTypeObj = obj.alerttype;
		$scope.editAlertTypeObj.operation= 1;
	};
	$scope.saveAlertType = function() {	
		if($("#txtAlertType").val() == "")
		{
			$("#errMsg").html("Invalid Data").show();
			$("#txtAlertType").addClass("error");
			return false;
		}
		else{
			$http.post('/alerttype',{
				alert_type_id: $scope.editAlertTypeObj.alert_type_id,
				alert_type: $scope.editAlertTypeObj.alert_type,
				operation: $scope.editAlertTypeObj.operation,
			}).success(function(response){
				if(response.value == "Success")
				{
					$('#divEditAlertType').modal('hide');
					if($scope.editAlertTypeObj.operation== 0)
						$scope.alerttypes.push($scope.editAlertTypeObj);
				}
				else
				{
					$('#divEditAlertType').modal('hide');
					alert(response.Message);
				}
			});
		}
	};
	
	$scope.confirmDeleteAlertType = function(obj) {
		
		$scope.deleteAlertTypeObj = obj.alerttype;
		$("#mb-alerttypedelete").toggleClass("open");
		
	};
	
	$scope.cancelDeleteAlertType = function() {
		$("#mb-alerttypedelete").removeClass("open");
		return false;
	};
	
	
	$scope.deleteAlertType = function(alert_type_id) {
		
		$http.post('/deleteAlertType', {"alert_type_id": alert_type_id}).
		  success(function(data, status, headers, config) {
			  angular.forEach($scope.alerttypes, function(value, key) {
				  if(value.alert_type_id == alert_type_id){
					  console.log("key:: "+key);
					  delete $scope.alerttypes[key];
					  $scope.alerttypes.splice(key,1);
				  }
				  
			});
			
			$("#mb-alerttypedelete").removeClass("open");
			
			alert("Record Deleted Successfully");
			return false;
		}).
		error(function(data, status, headers, config) {
			window.location = '/error';
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	};
});

app.controller('checkpointController',function($scope,$http,$location,authenticationService){
	
	$http.get("/getcheckpoint").success(function(response){
		$scope.checkpoints = response.resultsData;
		 
		 angular.element(document).ready(function () {
			 
			 if($("#tblAlertTypeList").length > 0){  
				 $('#tblAlertTypeList').DataTable().search( $(this).val() ).draw();
			 }
		 });
			
	});
	
	 $scope.cancelCheckpoint = function() {
		 document.getElementById("frmcheCheckpointAddEdit").reset(); 
	 };
	 
	$scope.addCheckpoint = function(){
		
		$("#errMsg").hide();
		$(".error").removeClass("error");
		
		 $scope.editCheckpointObj =  {
                 "checkpoint_id":null,
                 "building_id":null,
                 "latitude":null,
                 "longitude":null,
                 "checkpoint_name":null,
                 "operation":0
             };
		/* var jvalidate = $("#frmcheCheckpointAddEdit").validate({
             ignore: [],
             rules: {                                            
            	 txtCheckpoint: {
                             required: true
                     },
                     txtBuilding: { 
                    	 	required: true 
                     },
                     txtLatitude: { 
                 	 	required: true,
                     },
                     txtLongitude: { 
                  	 	required: true, 
                      }
                 }
             }); 
		 $("#frmcheCheckpointAddEdit").validate();*/
	};
	
	$scope.editCheckpoint = function(obj) {
		
		$("#errMsg").hide();
		$(".error").removeClass("error");
		
		$scope.editCheckpointObj = obj.checkpoint;
		$scope.editCheckpointObj.operation = 1;
		console.log(obj.checkpoint);
		 if($(".datepicker").length > 0){
             $(".datepicker").datepicker({format: 'yyyy-mm-dd'});                
             $("#dp-2,#dp-3,#dp-4").datepicker(); // Sample
         } 
		 var jvalidate = $("#frmcheCheckpointAddEdit").validate({
             ignore: [],
             rules: {                                            
            	 txtCheckpoint: {
                             required: true
                     },
                     txtBuilding: { 
                    	 	required: true 
                     },
                     txtLatitude: { 
                 	 	required: true,
                     },
                     txtLongitude: { 
                  	 	required: true, 
                      }
                 }
             }); 
		 
		 $("#frmcheCheckpointAddEdit").validate();
	};
	$scope.saveCheckpoint = function() {	
		if($("#txtCheckpoint").val() == "")
		{
			$("#errMsg").html("Invalid Data").show();
			$("#txtCheckpoint").addClass("error");
			return false;
		}
		else if($("#txtBuiding").val() == "")
		{
			$("#errMsg").html("Invalid Data").show();
			$("#txtBuiding").addClass("error");
			return false;
		}
		else if($("#txtLatitude").val() == "")
		{
			$("#errMsg").html("Invalid Data").show();
			$("#txtLatitude").addClass("error");
			return false;
		}
		else if($("#txtLongitude").val() == "")
		{
			$("#errMsg").html("Invalid Data").show();
			$("#txtLongitude").addClass("error");
			return false;
		}
		else{
			$("#errMsg").hide();
			$(".error").removeClass("error");
			
			 
			$http.post('/checkpoint',{
				checkpoint_id: $scope.editCheckpointObj.checkpoint_id,
				building_id: $scope.editCheckpointObj.building_id,
				latitude: $scope.editCheckpointObj.latitude,
				longitude: $scope.editCheckpointObj.longitude,
				checkpoint_name: $scope.editCheckpointObj.checkpoint_name,
					operation: $scope.editCheckpointObj.operation
			})
			.success(function(response){
				if(response.value == "Success"){
					$('#divEditCheckpoint').modal('hide');
					$scope.checkpoints.push($scope.editCheckpointObj);
				}
				else{
			
					alert(response.Message);
				}
			});
		}
		
		
	};
	
	
	$scope.confirmDeleteCheckpoint = function(obj) {
		
		//console.log(obj);
		$scope.deleteCheckpointObj = obj.checkpoint;
		$("#mb-checkpointdelete").toggleClass("open");
	};
	
	$scope.cancelDeleteCheckpoint = function() {
		$("#mb-checkpointdelete").removeClass("open");
		return false;
	};
	
	
	$scope.deleteCheckpoint = function(checkpoint_id) {
		console.log(checkpoint_id);
		$http.post('/deleteCheckpoint', {"checkpoint_id": checkpoint_id}).
		  success(function(data, status, headers, config) {
			  angular.forEach($scope.checkpoints, function(value, key) {
				  if(value.checkpoint_id == checkpoint_id){
					  console.log("key:: "+key);
					  delete $scope.checkpoints[key];
					  $scope.checkpoints.splice(key,1);
				  }
			});
			
			$("#mb-checkpointdelete").removeClass("open");
			
			alert("Record Deleted Successfully");
			return false;
			 
		}).
		error(function(data, status, headers, config) {
			window.location = '/error';
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	};
	
});

//--------start---------
//Guard  April 18,2015 


var app_guard = angular.module('workforce_guard_module_angular_app', ['ngRoute','ui.bootstrap']);
app_guard.service('authenticationServiceGuard',function($window){
	//alert("In Authentication Code..!!" + localStorage.getItem("userSSN"));
	if(localStorage.getItem("userSSN") == null || localStorage.getItem("userSSN") == 'undefined'){
		window.location = '/login';
	}
		
});

app_guard.controller('ProfileNameController',function($http,$scope,authenticationServiceGuard){
	
	$http({
			method : 'GET',
			url : '/getPersonNameType'
		}).success(function(response) {
			
			console.log("success");
			if(response.value === "Success"){
				//alert("output: "+JSON.stringify(response.personNameType[0].personName));
				//console.log("JSON value::::::::: "+response.personNameType);
				$scope.personInfo = response.resultsData[0].personName;
			}
		}).error(function(error) {
		//console.log("error");
			window.location = '/error';
	});
});

app_guard.controller('logoutController',function($scope,$http,authenticationServiceGuard){
	
	$scope.logout = function(){
		//alert($scope.alert_description + " " + $scope.alert_date +  " "+$scope.alert_time);
		console.log("here");
		
		var reqLogOut = {
				method : 'POST',
				url : '/logout',
				
			};
		$http(reqLogOut).success(function(response) {
			if (response.value === "Success") {					
				window.location="/login";			
			} else {
				alert("Signout not working.");
			}	
		}).error(function(error) {
			window.location = '/error';
			alert("Error in handling logout details");
		});
	};
});



app_guard.config(['$routeProvider',
         function($routeProvider,$locationProvider) {
	
				$routeProvider.
				
				when('/guard_home/', {
					templateUrl: '../views/html/guard_home.html',
					controller: 'homeController'
  
				}).
				when('/guard_schedule/', {
					templateUrl: '../views/html/guard_schedule.html',
					controller: 'scheduleController'
  
				}).
				when('/tab-first/', {
					templateUrl: '../views/html/guard_schedule.html',
					controller: 'scheduleController'
  
				}).
				when('/tab-second/', {
					templateUrl: '../views/html/guard_schedule.html',
					controller: 'scheduleController'
  
				}).
				when('/tab-third/', {
					templateUrl: '../views/html/guard_schedule.html',
					controller: 'scheduleController'
  
				}).
				when('/guard_checkIn/', {
					templateUrl: '../views/html/guard_checkIn.html',
					controller: 'checkInController'
  
				}).
             otherwise({
               redirectTo: '/guard_home/',
             });
           //$locationProvider.html5Mode(true);
       }
]);

//------------end----------------


//Client module code: Added by Arpit
//Client code added by arpit

var app_customer = angular.module('workforce_client', ['ngRoute','ui.mask']);

app_customer.service('authenticationServiceCustomer',function($window){
	//alert("In Authentication Code..!!" + localStorage.getItem("userSSN"));
	if(localStorage.getItem("userSSN") == null || localStorage.getItem("userSSN") == 'undefined'){
		window.location = '/login';
	}
		
});

app_customer.config(['$routeProvider',
   function($routeProvider,$locationProvider) {
				$routeProvider.
				
				when('/client_dashboard/', {
					templateUrl: 'client_dashboard.html',
					controller: 'clientDashboardController'

				}).
				when('/logout', {
					templateUrl: '../views/html/adminClient.html',
					controller: 'logoutController'
     
				}).
				when('/client_bill_info/', {
					templateUrl: '../views/html/client_bill_info.html',
					controller: 'billingController'

				}).
				when('/reports/', {
					templateUrl: '../views/html/reports.html',
					controller: 'reportController'

				}).
				when('/alerts/', {
					templateUrl: '../views/html/alerts.html',
					controller: 'alertController'

				}).
				when('/alertdashboard/', {
					templateUrl: '../views/html/alertdashboard.html',
					controller: 'alertDashboardController'

				}).
				when('/buildings/', {
					templateUrl: '../views/html/buildings.html',
					controller: 'buildingsController'

				}).
				when('/ReportSelected/', {
					templateUrl: '../views/html/ReportSelected.html',
					controller: 'reportSelectedController'

				}).
				when('/guard_check_points/', {
					templateUrl: '../views/html/guard_check_points.html',
					controller: 'CheckPointsController'
				}).
				when('/payement/', {
					templateUrl: '../views/html/payement.html',
					controller: 'PayementController'
				}).
       otherwise({
         redirectTo: '/client_dashboard',                         
       });
     //$locationProvider.html5Mode(true); alertDashboardController
 }
]);


app_customer.controller('CheckPointsController',CheckPointsController);
function CheckPointsController($http,$scope,authenticationServiceCustomer){ 
	
	
	$scope.checkpoint=function(){ 
	$http({
	    method : 'GET',
	    url : '/getCheckPointsForClient'
	    }).success(function(response) {
	            
	            
	            if(response.value==="Success"){
	            	
	            	
	            	console.log(response.resultsData);
	            	
	            	var buildinglist = [];
	            	var buildinglistobj= {};
	            	var i=0;
	            	var j=0;
	            	var checkpointlist = [];
	            	$.each(response.resultsData, function( index, objBuilding ) {
	            		  
	            		  if($.inArray(objBuilding.building_id,buildinglist) == "-1"){
	            			  buildinglist.push(objBuilding.building_id);
	            			  buildinglistobj[objBuilding.building_id] = objBuilding;
	            			  i++;
	            			  j=0;
	            			  
	            			  checkpointlist[objBuilding.building_id] = [];
		            		  
	            		  }
	            		  else{
	            			  buildinglistobj[objBuilding.building_id] = objBuilding;
	            			  j++;
	            		  }
	            		
	            		  checkpointlist[objBuilding.building_id][j] = {};
	            		  checkpointlist[objBuilding.building_id][j].latitude = objBuilding.latitude;
	            		  checkpointlist[objBuilding.building_id][j].longitude = objBuilding.longitude;
	            		  checkpointlist[objBuilding.building_id][j].checkpoint_name = objBuilding.checkpoint_name;
	            		  
	            		});
	            		  
	            		  $.each(buildinglistobj, function( key, objb) {
	            			  buildinglistobj[key].checkpointlist = checkpointlist[key];
	            		  });
	            		
	            		$scope.buildinglist = buildinglistobj;
	            		
	            	}
	            
	    
	    }).error(function(error) {
	    	window.location = '/error';
	    //console.log("error");
	    	});
	};
		
	$scope.viewCheckpoints = function(obj) {
		
		console.log("obj");
		console.log(obj.building);
		var myLatLngList = [];
		var myMarkers = [];
		
		var map;
		//alert("checkpointsss: "+JSON.stringify(obj.building.checkpointlist));
		//obj.building.checkpointlist = [{latitude: "51.508742", longitude: "51.607742", checkpoint_name: "c1", $$hashKey: "005"},
		//                               {latitude: "51.908742", longitude: "52.0021", checkpoint_name: "c2", $$hashKey: "006"}];
		
		
		var mapOptions = {
			    zoom: 17,
			    center: new google.maps.LatLng(obj.building.checkpointlist[0].latitude,obj.building.checkpointlist[0].longitude)
			  };
		
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		$.each(obj.building.checkpointlist,function(idx,chkpoint){
			var myLatlng = new google.maps.LatLng(chkpoint.latitude,chkpoint.longitude);
			console.log(chkpoint);
			myLatLngList.push(myLatlng);
			
			var marker = new google.maps.Marker({
			      position: myLatlng,
			      map: map,
			      title: chkpoint.checkpoint_name
			  });
			myMarkers.push(marker);
			
		});
		function initialize() {
			 // var myLatlng1 = new google.maps.LatLng(obj.check.latitude1,obj.check.longitude1);
			  //var myLatlng2 = new google.maps.LatLng(obj.check.latitude2,obj.check.longitude2);
			  //var myLatlng3 = new google.maps.LatLng(obj.check.latitude3,obj.check.longitude3);
			  //var myLatlng4 = new google.maps.LatLng(obj.check.latitude4,obj.check.longitude4);
			  var mapOptions = {
			    zoom: 6,
			    center: myLatLngList[1]
			  };
		}
			google.maps.event.addListenerOnce(map, 'idle', function() {
			   google.maps.event.trigger(map, 'resize');
			   map.setZoom(17);
			   map.setCenter(myLatLngList[1]);
			});
			
			$(window).checkResize(function() {
			    // (the 'map' here is the result of the created 'var map = ...' above)
			    google.maps.event.trigger(map, "resize");
			    map.setZoom(17);
				map.setCenter(myLatLngList[1]);
			  });
			  var marker1 = new google.maps.Marker({
			      position: myLatlng1,
			      map: map,
			      title: 'Hello World 1!'
			  });
			  var marker2 = new google.maps.Marker({
			      position: myLatlng2,
			      map: map,
			      title: 'Hello World  2!'
			  });
			  var marker3 = new google.maps.Marker({
			      position: myLatlng3,
			      map: map,
			      title: 'Hello World  3!'
			  });
			  var marker4 = new google.maps.Marker({
			      position: myLatlng4,
			      map: map,
			      title: 'Hello World  4!'
			  });
			
		
		angular.element(document).ready(function () {
			
			initialize();
			//google.maps.event.addDomListener(window, 'load', );
		});
		
	}; 
	
}

app_customer.controller('PayementController',PayementController);
function PayementController($http,$scope,authenticationServiceCustomer){
	
var jvalidate = $("#frmPayement").validate({
        ignore: [],
        rules: {                                            
        	payementName: {
                        required: true,
                        maxlength: 19,
                        number: false
                },
                payementNumber: { 
               	 	required: true,
               	 	number: true,
               	    minlength: 16,
               	    maxlength: 16
               	 	
                },
                payementExpiryMonth: { 
            	 	required: true
                 	
                },
                payementExpiryYear: { 
             	 	required: true
             	 	
                 },
                 payementCVV: { 
               	  required: true,
               	    number: true,
               	    minlength: 3,
               	    maxlength: 3
                },
                
                payementAmount: { 
                  	  required: true,
                  	    number: true,
                  	    minlength: 1
                  	    
                   }
                 
            }
        });	
	
	$scope.submit = function(){	
		 $scope.value = "Payement Successful !!";
	 };
	
}


app_customer.controller('ProfileNameController',function($http,$scope,authenticationServiceCustomer){
	$http({
			method : 'GET',
			url : '/getPersonNameType'
		}).success(function(response) {
			
			console.log("success");
			if(response.value==="Success"){
				
				$scope.personInfo = response.resultsData[0].personName;	
			}
		}).error(function(error) {
			//console.log("error");
			window.location = '/error';
		});	
});

app_customer.controller('BarGraphController',function($http,$scope,authenticationServiceCustomer){
    
    $http({
                    method : 'GET',
                    url : '/getBarGraphData'
            }).success(function(response) {
     
                    if(response.value=="Success"){
                    	$(function(){                    
                                     /* Bar dashboard chart */
                                     Morris.Bar({
                                     element: 'dashboard-bar-1',
                                     //data: response.resultsData,
                                     data: response.resultsData,
                                     xkey: 'y',
                                     ykeys: ['a', 'b'],
                                     labels: ['High','Low'],
                                     barColors: ['#33414E', '#1caf9a'],
                                     gridTextSize: '10px',
                                     hideHover: true,
                                     resize: true,
                                     gridLineColor: '#E5E5E5'
                                     });
                                     /* END Bar dashboard chart */
                                                   
                                 $(".x-navigation-minimize").on("click",function(){
                                     setTimeout(function(){
                                         rdc_resize();
                                     },200);    
                                 });
                                                
                             });                   
                    }
            }).error(function(error) {
                    console.log("error");
      });        
});



app_customer.controller('DonutController',function($http,$scope,authenticationServiceCustomer){
   
    //var graph=[];
    $http({
                    method : 'GET',
                    url : '/getDonutData'
            }).success(function(response) {
               if(response.value==="Success"){

                             $(function(){        
                             
                                 Morris.Donut({
                                     element: 'dashboard-donut-1',
                                     data:response.resultsData,
                                     colors: ['#33414E', '#1caf9a'],
                                     resize: true
                                 });
                                 
                                 
                                 $(".x-navigation-minimize").on("click",function(){
                                     setTimeout(function(){
                                         rdc_resize();
                                     },200);    
                                 });
                                 
                                 
                             });
                               
                    }
            }).error(function(error) {
                    //console.log("error");
                    window.location = '/error';
            });        
});

app_customer.controller('clientDashboardController',clientDashboardController);

function clientDashboardController($scope,$http,authenticationServiceCustomer){
//morris start
	var now     = new Date();
    var hour    = now.getHours();
    var minutes = now.getMinutes();                    
    
    hour = hour < 10 ? '0'+hour : hour;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    
    $(".plugin-clock").html(hour+"<span>:</span>"+minutes);
	
	
	$scope.showBuildingCount = function() { 
    $http({
    method : 'GET',
    url : '/getTotalBuildingCountPerClient'
    }).success(function(response) {
            
            
            if(response.value==="Success"){
            
                    $scope.buildingCount = response.resultsData[0].numberOfBuilding;
            
            }
    

    }).error(function(error) {
    	window.location = '/error';
   // console.log("error");

    	});

    };

	$scope.showDues = function() {
		$http({
		method : 'GET',
		url : '/getDueDetails'
		}).success(function(response) {
			
			console.log("success");
			if(response.value==="Success"){
				
				$scope.dues = response.resultsData;
			
			}
		

		}).error(function(error) {
			window.location = '/error';
			//console.log("error");

		});

	};
		
	$scope.showProfileName = function() {
	

	$http({
		method : 'GET',
		url : '/getPersonNameType'
	}).success(function(response) {
		
		console.log("success");
		if(response.value==="Success"){
			
			console.log("JSON Response::::::::: "+response.personNameType);
			$scope.dues = response.ClientDues;	
		}
	}).error(function(error) {
		window.location = '/error';
		//console.log("error");

		});

	};
	
	$scope.showAlertCount = function() { 
        $http({
        method : 'GET',
        url : '/getTotalAlertCountPerClient'
        }).success(function(response) {
                
                console.log("success");
                if(response.value==="Success"){
                        $scope.alertCount = response.resultsData[0].numberOfAlert;
                }
        }).error(function(error) {
        	window.location = '/error';
        	//console.log("error");

        });

    };

	//morris end
}




app_customer.controller('alertController',alertController);

function alertController($scope,$http,authenticationServiceCustomer){

	$scope.showAlerts = function() {
		$http({
			method : 'GET',
			url : '/getAlertReport',
		}).success(function(response) {
			
			console.log("success");
			if(response.value==="Success"){
				console.log("JSON Response::::::::: "+response.resultsData);
				$scope.alert = response.resultsData;
            angular.element(document).ready(function () {
        		
        		
       		 if($("#tbl_alert").length > 0){  console.log($(this).val);
       			 $('#tbl_alert').DataTable().search( $(this).val() ).draw();
       			 
       		 }
       	 });			
	}
		}).error(function(error) {
			window.location = '/error';
			//console.log("error");

		});

	};
}

app_customer.controller('reportController',function($scope,$http,authenticationServiceCustomer){
	
	$scope.ReportSelected = function(obj) {
		console.log(obj);

			$scope.oldreportDisplay = obj.reportDisplay;
			
		var date = obj.reportDisplay.reportDate;
		var dateConverted = date.substring(0, date.length-14);
		$scope.date = dateConverted;
		//first query
		$http.post('/getPatrolScheduleForReportSelected',{
			"reportDate": dateConverted,
			"buildingID": obj.reportDisplay.buildingID
			
		}).success(function(response) {
		if(response.value=="Success"){
			
				//alert("Response :"+JSON.stringify(response.resultsData));
				$scope.patrolValue = response.resultsData;
				//$scope.patrolValue = [{"id":"1","record_time":"19:51:13","guard_name":"Arpit Khare"}];
				//alert("Shit happens here : " + $scope.patrolValue);
				
//				localStorage.setItem("patrolSchedule",$scope.patrol);
				//patrolFunction(patrol);
				
			}
		}).error(function(error) {
			window.location = '/error';
			//console.log("error");
		});
		
		//second query
		$http.post('/getPatrolingReportDataForSelectedReport',{
			"reportDate": dateConverted,
			"buildingID": obj.reportDisplay.buildingID
			
		}).success(function(response) {
			
			console.log("success");
			if(response.value=="Success"){
				console.log("value for second: "+JSON.stringify(response.resultsData));
				$scope.reportValue=response.resultsData;	
			}
		}).error(function(error) {
			window.location = '/error';
			//console.log("error");
		});
		
//third query	
		$http.post('/getPatrolDataGuardComments',{
			"reportDate": dateConverted,
			"buildingID": obj.reportDisplay.buildingID
			
		}).success(function(response) {
			
			console.log("success");
			if(response.value=="Success"){
				//alert("guardComments "+JSON.stringify(response.resultsData));
				$scope.guardComments=response.resultsData;	
			}
		}).error(function(error) {
			window.location = '/error';
			//console.log("error");
		});
		
		//localStorage.setItem("buildName",obj.reportDisplay.buildingName);
		//localStorage.setItem("date",obj.reportDisplay.reportDate);
	
	};	
	
	
	$scope.showReports = function() {
		$http({
			method : 'GET',
			url : '/getDailyReports',
		}).success(function(response) {
			
			console.log("success");
			if(response.value=="Success"){
				$scope.report=response.resultsData;	
				angular.element(document).ready(function () {
					 if($("#tbl_report").length > 0){ 
						 $('#tbl_report').DataTable().search( $(this).val() ).draw();
					 }
				});
			}
		}).error(function(error) {
			window.location = '/error';
			//console.log("error");
		});
	};	
});

app_customer.controller('billingController',function($scope,$http,authenticationServiceCustomer){
	
$scope.showBills = function() {
		
		$http({
			method : 'GET',	
			url : '/getBillReports',
		}).success(function(response) {
			
			console.log("success");
			if(response.value=="Success"){
				
				console.log("JSON Response::::::::: "+response.resultsData);

				$scope.billing=response.resultsData;
				
				angular.element(document).ready(function () {
					 if($("#tbl_billing").length > 0){  
						 $('#tbl_billing').DataTable().search( $(this).val() ).draw();
					 }
				 });
				
			}
		

		}).error(function(error) {
			window.location = '/error';
			//console.log("error");

		});

	};

});


app_customer.controller('reportSelectedController',function($scope,$http,authenticationServiceCustomer){
	
	$scope.building=localStorage.getItem("buildName");
	$scope.reportDate=localStorage.getItem("date");

});
app_customer.controller('alertDashboardController',function($scope,$http,authenticationServiceCustomer){
	
	$scope.showAlertsOnDashboard = function() {
			
			$http({
				method : 'GET',
				url : '/getAlertDashboardReports',
			}).success(function(response) {
				console.log("success");
				if(response.value === "Success"){
					$scope.dailyAlertInfo=response.resultsData;
				}	
			}).error(function(error) {
				window.location = '/error';
				//console.log("error");
			});
		}; 
	});



app_customer.controller('logoutController',function($scope,$http){

	/* MESSAGE BOX */
    $(".mb-control").on("click",function(){
      console.log($(this));
      
        var box = $($(this).data("box"));
      console.log(box);
        if(box.length > 0){
            box.toggleClass("open");
            
            var sound = box.data("sound");
            
            if(sound === 'alert')
                playAudio('alert');
            
            if(sound === 'fail')
                playAudio('fail');
            
        }        
        return false;
    });
    $(".mb-control-close").on("click",function(){
       $(this).parents(".message-box").removeClass("open");
       return false;
    });    
    /* END MESSAGE BOX */
	
	$scope.logout = function(){
		//alert($scope.alert_description + " " + $scope.alert_date +  " "+$scope.alert_time);
		console.log("here");
		
		var reqLogOut = {
				method : 'POST',
				url : '/logout',
				
			};
		$http(reqLogOut).success(function(response) {
			if (response.value === "Success") {	
				alert("You have logged out successfully..!!");
				window.location="/login";			
			} else {
				alert("Signout not working.");
			}	
		}).error(function(error) {
			window.location = '/error';
			//alert("Error in handling logout details");
		});
	};
});


app_customer.controller('buildingsController',function($scope,$http,authenticationServiceCustomer){
	 
	$scope.showBuilding = function() {
		$http({
			method : 'GET',
			url : '/getBuildingReport',	
		}).success(function(response) {
			
			console.log("success");
			if(response.value==="Success"){
				
				$scope.buildings = response.resultsData;
				angular.element(document).ready(function () {
					 if($("#tbl_building").length > 0){ 
						 $('#tbl_building').DataTable().search( $(this).val() ).draw();
					 }
				});
				
			}

		}).error(function(error) {
			window.location = '/error';
			//console.log("error");

		});

	};
	
});



//Client code endc1//Client code endnar8it
