var myApp = angular.module('myApp');

myApp.controller('QueriesIIController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('QueriesII controller...');

	$scope.getQuery8 = function(){
		$http.get('api/query8').success(function(response){
			$scope.query8 = response;
		});
	}
	$scope.getQuery9 = function(){
		$http.get('api/query9').success(function(response){
			$scope.query9 = response;
		});
	}
	$scope.getQuery10 = function(){
		$http.get('api/query10').success(function(response){
			$scope.query10 = response;
		});
	}



	$scope.getQuery18 = function(){
		$http.get('api/query18').success(function(response){
			$scope.query18 = response;
		});
	}

	$scope.getQuery19 = function(){
		$http.get('api/query19').success(function(response){
			$scope.query19 = response;
		});
	}
	$scope.getQuery20 = function(){
		$http.get('api/query20').success(function(response){
			$scope.query20 = response;
		});
	}

	$scope.getQuery21 = function(){
		$http.get('api/query21').success(function(response){
			$scope.query21 = response;
		});
	}
	$scope.getQuery22 = function(){
		$http.get('api/query22').success(function(response){
			$scope.query22 = response;
		});
	}



	$scope.getQuery16 = function(){
		$http.get('api/query16').success(function(response){
			$scope.query16 = response;
		});
	}


	$scope.getQuery14 = function(){
		$http.get('api/query14').success(function(response){
			$scope.query14 = response;
		});
	}
	$scope.getQuery15 = function(){
		$http.get('api/query15').success(function(response){
			$scope.query15 = response;
		});
	}

	$scope.getQuery12 = function(){
		$http.get('api/query12').success(function(response){
			$scope.query12 = response;
		});
	}
	$scope.getQuery13 = function(){
		$http.get('api/query13').success(function(response){
			$scope.query13 = response;
		});
	}



	$scope.getQuery25 = function(){
		$http.get('api/query25').success(function(response){
			$scope.query25 = response;
		});
	}
	$scope.getQuery26 = function(){
		$http.get('api/query26').success(function(response){
			$scope.query26 = response;
		});
	}

	$scope.getQuery27 = function(){
		$http.get('api/query27').success(function(response){
			$scope.query27 = response;
		});
	}
	$scope.getQuery28 = function(){
		$http.get('api/query28').success(function(response){
			$scope.query28 = response;
		});
	}








}]);