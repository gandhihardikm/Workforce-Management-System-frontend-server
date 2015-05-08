//controller function for home.html page og Guard module
function homeController($scope,$http, authenticationServiceGuard){
	$scope.alert_checkpoint = 'c1';
	var reqGetAlertType = {
			method : 'GET',
			url : '/getalerttype'
		};
	$http(reqGetAlertType).success(function(response) {
			if (response.value === "Success") {
				//alert("Alert type added." + response.resultsData);
				$scope.alert_type = response.resultsData;
				//alert("Alert type added." + $scope.alert_type);
			} else {
			alert("Alert type not added.");
		}
	}).error(function(error) {
			alert("Error in adding alert details");
	});
	
	// create alter function called when user click create alert button of create alter tab
	$scope.create_alert = function(){
		//alert($scope.alert_description + " " + $scope.alert_date +  " "+$scope.alert_time);
		
		var reqAddAlertDetail = {
				method : 'POST',
				url : '/addalertdetail',
				data: {
					"Description": $scope.alert_description,
					"Date": $scope.alert_date,
					"Time": $scope.alert_time,
					"Checkpoint":$scope.alert_checkpoint,
					"Type":$scope.alert_type,
					"Severity":'HIGH',
					"Building":$scope.alert_building_name
				}
			};
		$http(reqAddAlertDetail).success(function(response) {
			if (response.value === "Success") {					
				window.location="/guard_dashboard";
				
			} else {
				alert("Alert not created.");
			}	
		}).error(function(error) {
			alert("Error in adding alert details");
		});
	};
	
	// function called to display list of all incidents reported by a particular guard on home.html page
	$scope.get_timeline_content = function(){

		var requestGetTimeLineDetails = {
				method : 'GET',
				url : '/getGuardTimelineDetail'
			};
		
		$http(requestGetTimeLineDetails).success(function(response) {
			if (response.value === "Success") {					
				//alert("timeline hello " + response.resultsData);
				$scope.timeline_display_object = response.resultsData;
			} else {
				alert("Check in not done.");
			}	
		}).error(function(error) {
			alert("Error in adding check in details");
		});		
	};
}