//controller function for guard_checkIn.html page og Guard module
function checkInController($scope,$http, authenticationServiceGuard){
	$scope.checkIn_checkpoint = 'c1';
	$scope.checkIn_time = new Date();
	
	// create alter function called when user click create alert button of create alter tab
	$scope.create_checkIn = function(){
//		alert($scope.checkIn_description + " " + $scope.checkIn_checkpoint +  " "+$scope.checkIn_building_name);
//		alert($scope.checkIn_time.getFullYear()+"-"+($scope.checkIn_time.getMonth()+1)+"-"+$scope.checkIn_time.getDate());
//		alert($scope.checkIn_time.getHours()+"-"+$scope.checkIn_time.getMinutes()+"-"+$scope.checkIn_time.getSeconds())
//		
		var reqAddCheckInDetail = {
				method : 'POST',
				// same add alert procedure called as data being inserted is same
				url : '/addalertdetail',
				data: {
					"Description": $scope.checkIn_description,
					"Date": $scope.checkIn_time.getFullYear()+"-"+($scope.checkIn_time.getMonth()+1)+"-"+$scope.checkIn_time.getDate(),
					"Time": $scope.checkIn_time.getHours()+":"+$scope.checkIn_time.getMinutes()+":"+$scope.checkIn_time.getSeconds(),
					"Checkpoint":$scope.checkIn_checkpoint,
					"Type":'Patrol',
					"Severity":'LOW',
					"Building":$scope.checkIn_building_name
				}
			};
		$http(reqAddCheckInDetail).success(function(response) {
			if (response.value === "Success") {	
				$scope.checkIn_description = "";
				$scope.checkIn_building_name = "";
				$scope.checkIn_checkpoint = "";
				

			} else {
				alert("Check in not done.");
			}	
		}).error(function(error) {
			alert("Error in adding check in details");
		});
	};
}