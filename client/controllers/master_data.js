var myApp = angular.module('myApp');

myApp.controller('MasterDataController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('Master Data controller...');
	$scope.getGrades = function(){
		$http.get('/api/query31').success(function(response){
			$scope.exams = response;
		});
	}

	$scope.removeGrade = function(id){
		$http.delete('/api/grades/'+id).success(function(response){
			window.location.href='#/';
		});
	}


}]);