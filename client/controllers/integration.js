var myApp = angular.module('myApp');

myApp.controller('IntegrationController', ['$scope', '$http', '$location', '$routeParams','auth',
	function($scope, $http, $location, $routeParams,auth){
	console.log('Master Data controller...');


	$scope.getGrades = function(){
		$http.get('/api/grades', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.exams = response;
		});
	}

	$scope.getSubjects = function(){
		$http.get('/api/subjects', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getTopics = function(){
		$http.get('/api/topics', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.topics = response;
		});
	}

	$scope.action1 = function(){	
			$scope.ssubject = null;
			$scope.stopic = null;
	}

	$scope.action2 = function(){	
			$scope.stopic = null;
	}

	$scope.action3 = function(){	
		$http.get('/api2/getVideosList/Khan/'+$scope.stopic).success(function(response){
			$scope.videosList = response;
		});
	}



}]);