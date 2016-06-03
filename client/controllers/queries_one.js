var myApp = angular.module('myApp');

myApp.controller('QueriesOneController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('QueriesOne controller...');
/*	$scope.getGrades = function(){
		$http.get('/api/grades').success(function(response){
			$scope.exams = response;
		});
	}

	$scope.getSubjects = function(){
		$http.get('/api/subjects').success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getGrade = function(){
		var id = $routeParams.id;
		$http.get('/api/grades/'+id).success(function(response){
			$scope.exam = response;
		});
	}


	$scope.addGrade = function(){
		$http.post('/api/grades/', $scope.grade).success(function(response){
			window.location.href='#/grades';
		});
	}

	$scope.updateGrade = function(){
		var id = $routeParams.id;
		$http.put('/api/grades/'+id, $scope.exam).success(function(response){
			window.location.href='#/grades';
		});
	}

	$scope.removeGrade = function(id){
		$http.delete('/api/grades/'+id).success(function(response){
			window.location.href='#/grades';
		});
	}*/

}]);