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
                text: 'Attempt Trend in last 30 days'
            }
        };


        

//////////////////////////////////////////////////////////////////////////////////////////

/* Student added trend -- starts*/

    $scope.getQuery18 = function(){
		$http.get('api/query18').success(function(response){
			$scope.query18 = response;
		});
	}

	/* Students added trend lastweek*/
	$scope.getQuery19 = function(){
		$http.get('api/query19').success(function(response){
			$scope.query19 = response;
		});
	}

	/* Students added count lastweek*/
	$scope.getQuery20 = function(){
		$http.get('api/query20').success(function(response){
			$scope.query20 = response;
		});
	}

	/* Students added trend last month*/
	$scope.getQuery21 = function(){
		$http.get('api/query21').success(function(response){
			$scope.query21 = response;

			console.log(response);

			var trend = response;
		    var chartData = [];

			  for(i=0; i<trend.length; i++)
			  {	

			      chartData.push({x: i , y: trend[i].count});
			  
			  }

		    console.log(chartData);
		    /*$scope.data = chartData;

			console.log($scope.query12);*/

			$scope.dataSignup = [{
                    values: chartData,      //values - represents the array of {x,y} data points
                    key: 'Student Added Trend', //key  - the name of the series.
                    color: '#1ca0c3',  //color - optional: choose your own line color.
                }];

		});
	}

	/* Students added count last month*/
	$scope.getQuery22 = function(){
		$http.get('api/query22').success(function(response){
			$scope.query22 = response;
		});
	}


/* Student added trend -- ends*/

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

/* Attempts trend -- starts*/
	
	/* Attempts count yesterday*/
	$scope.getQuery16 = function(){
		$http.get('api/query16').success(function(response){
			$scope.query16 = response;
		});
	}

	/* Attempts trend lastweek*/
	$scope.getQuery14 = function(){
		$http.get('api/query14').success(function(response){
			$scope.query14 = response;
		});
	}

	/* Attempts count lastweek*/
	$scope.getQuery15 = function(){
		$http.get('api/query15').success(function(response){
			$scope.query15 = response;
		});
	}

	/* Attempts trend last month*/
	$scope.getQuery12 = function(){
		$http.get('api/query12').success(function(response){
			$scope.query12 = response;

			var trend = response;
		    var chartData = [];

			  for(i=0; i<trend.length; i++)
			  {	

			      chartData.push({x: i , y: trend[i].count});
			  
			  }

		    console.log(chartData);
		    /*$scope.data = chartData;

			console.log($scope.query12);*/

			$scope.dataAttempt = [{
                    values: chartData,      //values - represents the array of {x,y} data points
                    key: 'Attempt Trend', //key  - the name of the series.
                    color: '#e89279',  //color - optional: choose your own line color.
                }];


		});
	}

	/* Attempts count last month*/
	$scope.getQuery13 = function(){
		$http.get('api/query13').success(function(response){
			$scope.query13 = response;
		});
	}

/* Attempts trend -- ends*/



}]);