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


}]);