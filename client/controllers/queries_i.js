var myApp = angular.module('myApp');

myApp.controller('QueriesIController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('QueriesI controller...');

	$scope.getQuery1 = function(){
		$http.get('api/query1').success(function(response){
			$scope.query1 = response;
		});
	}

	$scope.getQuery3 = function(){
		$http.get('api/query3').success(function(response){
			$scope.query3 = response;
		});
	}

	$scope.getQuery4 = function(){
		$http.get('api/query4').success(function(response){
			$scope.query4 = response;
		});
	}

	$scope.getQuery5 = function(){
		$http.get('api/query5').success(function(response){
			$scope.query5 = response;
		});
	}


	$scope.getQuery7 = function(){
		$http.get('api/query7').success(function(response){
			$scope.query7 = response;
		});
	}
	$scope.getQuery23 = function(){
		$http.get('api/query23').success(function(response){
			$scope.query23 = response;
		});
	}
	$scope.getQuery24 = function(){
		$http.get('api/query24').success(function(response){
			$scope.query24 = response;
		});
	}


}]);