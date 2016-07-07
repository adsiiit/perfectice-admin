var myApp = angular.module('myApp');

myApp.controller('BusinessPerfoController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('Business Performance controller...');

	$scope.options = {
            chart: {
                type: 'lineChart',
                height: 300,
                width: 550,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Day'
                },
                yAxis: {
                    axisLabel: 'Count',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: false,
                text: 'Write your text and enable it'
            }
        };



//////////////////////////////////////////////////////////////////////////////////////////

/* Student added trend -- starts*/

	/* Students added trend last month*/
/*	$scope.studentsTrend30 = function(){
		$http.get('api/query19/30').success(function(response){
			$scope.studentstrend30 = response;
			var trend = response;
		    var chartData = [];
			  for(i=0; i<trend.length; i++)
			  {
			      chartData.push({x: i+1 , y: trend[i].count});
			  }
			$scope.dataStudents30 = [{
                    values: chartData,      //values - represents the array of {x,y} data points
                    key: 'Student Added Trend', //key  - the name of the series.
                    color: '#1ca0c3',  //color - optional: choose your own line color.
                }];

		});
	}*/

	/* Students added count last month*/
/*	$scope.studentsCount30 = function(){
		$http.get('api/query18/30').success(function(response){
			$scope.studentscount30 = response;
		});
	}
*/

/* Student added trend -- ends*/

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

/* Attempts trend -- starts*/


	$scope.attemptsTrend=function()
	{
		$http.get('api/query12/7').success(function(response){
				$scope.attemptstrend = response;
				var trend = response;
			    var chartData = [];

				  for(i=0; i<trend.length; i++)
				  {	
				      chartData.push({x: i+1 , y: trend[i].count});
				  }
			    //console.log(chartData);
				$scope.dataAttempt = [{
	                    values: chartData,    
	                    key: 'Attempt Trend',
	                    color: '#d9534f',  
	                }];
			});
	}

	
	$scope.slider1 = {
	  value1: 7,
	  options1: {
	    showTicksValues: true,
	    stepsArray: [
	      {value: 7},
	      {value: 30},
	      {value: 45},
	      {value: 90},
	      {value: 180}
	    ],
	    onChange: function(){
	    	//console.log(($scope.slider1).value1);
	    	var val = String(($scope.slider1).value1);
	    	$http.get('api/query12/'+val).success(function(response){
				$scope.attemptstrend = response;
				var trend = response;
			    var chartData = [];

				  for(i=0; i<trend.length; i++)
				  {	
				      chartData.push({x: i+1 , y: trend[i].count});
				  }
			    //console.log(chartData);
				$scope.dataAttempt = [{
	                    values: chartData,    
	                    key: 'Attempt Trend',
	                    color: '#d9534f',  
	                }];
			});
	    }
	  }
	};


	/* Attempts count last month*/
/*	$scope.attemptsCount30 = function(){
		$http.get('api/query13/30').success(function(response){
			$scope.attemptscount30 = response;
		});
	}
*/
/* Attempts trend -- ends*/



///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

/* Signup trend -- starts*/
	
	
	$scope.signupTrend=function()
	{
		$http.get('api/query34/7').success(function(response){
				$scope.signuptrend = response;
				var trend = response;
			    var chartData = [];
				  for(i=0; i<trend.length; i++)
				  {	
				      chartData.push({x: i+1 , y: trend[i].count});
				  }
				$scope.dataSignup = [{
	                    values: chartData,     
	                    key: 'Signup Trend', 
	                    color: '#1ca0c3', 
	                }];
			});
	}	


	$scope.slider2 = {
	  value2: 7,
	  options2: {
	    showTicksValues: true,
	    stepsArray: [
	      {value: 7},
	      {value: 30},
	      {value: 45},
	      {value: 90},
	      {value: 180}
	    ],
	    onChange: function(){
	    	//console.log(($scope.slider2).value2);
	    	var val = String(($scope.slider2).value2);
			$http.get('api/query34/'+val).success(function(response){
				$scope.signuptrend = response;
				var trend = response;
			    var chartData = [];
				  for(i=0; i<trend.length; i++)
				  {	
				      chartData.push({x: i+1 , y: trend[i].count});
				  }
				$scope.dataSignup = [{
	                    values: chartData,     
	                    key: 'Signup Trend', 
	                    color: '#1ca0c3', 
	                }];
			});
	    }
	  }
	};


/* Signup trend -- ends*/


	

}]);