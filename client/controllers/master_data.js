var myApp = angular.module('myApp');

myApp.controller('MasterDataController', ['$scope', '$http', '$location', '$routeParams','auth',
	function($scope, $http, $location, $routeParams,auth){
	console.log('Master Data controller...');
	$scope.getGrades = function(){
		$http.get('/api/query31', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.exams = response;
		});
	}

	$scope.removeGrade = function(id){
		$http.delete('/api/grades/'+id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			window.location.href='#/';
		});
	}

	$scope.isLoggedIn = auth.isLoggedIn;


}]);