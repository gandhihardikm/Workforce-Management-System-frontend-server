/**
 * New node file
 */

function scheduleController($scope,$http, authenticationServiceGuard){
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";

	
	// function called to list down all building for which he has duty in this month
	$scope.get_guard_building_list = function(){
		
		/*$scope.building_list_object = [
			                               {"building_name":"Legacy Fountain Plaza"},
			                               {"building_name":"Vella Torento"},
			                               {"building_name":"Junglee Building"},
			                               {"building_name":"Old Monk"}
		                              ];*/
		
		var requestGetBuildingList = {
				method : 'GET',
				url : '/getGetBuildingList'
			};
		
		$http(requestGetBuildingList).success(function(response) {
			if (response.value === "Success") {					
			//	alert("Building hello " + response.resultsData);
				$scope.building_list_object = response.resultsData;
			} else {
				alert("Check in not done.");
			}	
		}).error(function(error) {
			alert("Error in adding check in details");
		});	
	};
	
	$scope.getTab1Data = function(){
		
		// get the month for schedule is being displayed
		$scope.month_tab1 = month[((new Date()).getMonth())-1];
		var requestPreviousMonthSchedule = {
				method : 'GET',
				url : '/getSchedule/'+((new Date()).getMonth())
		};
		$http(requestPreviousMonthSchedule).success(function(response) {
			if (response.value === "Success") {					
			//	alert(" Previous Schedule report " + response.resultsData);
				$scope.tab1_data_object = response.resultsData;
			} else {
				alert("Previous Schedule data not fetched.");
			}	
		}).error(function(error) {
			alert("Error in adding previous schedule in details");
		});	
	};
		/*$scope.tab1_data_object = [
		                           {"date":"March 24, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Day","classCSS":"active" },
		                           {"date":"March 25, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Day","classCSS":"active" },
		                           {"date":"March 26, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Night","classCSS":"success" }
		                           ];*/
	
	
	
	$scope.getTab2Data = function(){
		
		// get the month for schedule is being displayed
		$scope.month_tab2 = month[(new Date()).getMonth()];
		
		var requestCurrentMonthSchedule = {
				method : 'GET',
				url : '/getSchedule/'+(((new Date()).getMonth())+1)
		};
		$http(requestCurrentMonthSchedule).success(function(response) {
			if (response.value === "Success") {					
			//	alert("Current Schedule report " + response.resultsData);
				$scope.tab2_data_object = response.resultsData;
			} else {
				alert("Current Schedule data not fetched.");
			}	
		}).error(function(error) {
			alert("Error in adding current schedule in details");
		});	
	};
		/*$scope.tab2_data_object = [
		                           {"date":"April 24, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Day","classCSS":"active" },
		                           {"date":"April 25, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Day","classCSS":"active" },
		                           {"date":"April 26, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Night","classCSS":"success" }
		                           ];
	};*/
	
	$scope.getTab3Data = function(){
		
		// get the month for schedule is being displayed
		$scope.month_tab3 = month[((new Date()).getMonth())+1];
		
		var requestNextMonthSchedule = {
				method : 'GET',
				url : '/getSchedule/'+(((new Date()).getMonth())+2)
		};
		$http(requestNextMonthSchedule).success(function(response) {
			if (response.value === "Success") {					
			//	alert("Next Schedule report " + response.resultsData);
				$scope.tab3_data_object = response.resultsData;
			} else {
				alert("Next Schedule data not fetched.");
			}	
		}).error(function(error) {
			alert("Error in adding next schedule in details");
		});	
	};
		
		/*$scope.tab3_data_object = [
		                           {"date":"May 24, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Day","classCSS":"active" },
		                           {"date":"May 25, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Day","classCSS":"active" },
		                           {"date":"May 26, 2015","client_name":"Mark","building_name":"Legacy Fountain Plaza","building_address":"# 190 Ryland Street, 95110","shift":"Night","classCSS":"success" }
		                           ];
	}; */
	
}