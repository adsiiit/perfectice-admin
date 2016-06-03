var myApp = angular.module('myApp');

myApp.controller('SubjectsController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('Subjects controller...');
	$scope.getSubjects = function(){
		$http.get('/api/subjects').success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getGrades = function(){
		$http.get('/api/grades').success(function(response){
			$scope.grades = response;
		});
	}

	$scope.getTopics = function(){
		$http.get('/api/topics').success(function(response){
			$scope.topics = response;
		});
	}

	$scope.getSubject = function(){
		var id = $routeParams.id;
		$http.get('/api/subjects/'+id).success(function(response){
			$scope.subject = response;
		});
	}


	$scope.addSubject = function(){
		$http.post('/api/subjects/', $scope.subject).success(function(response){
			window.location.href='#/subjects';
		});
	}

	$scope.updateSubject = function(){
		var id = $routeParams.id;
		$http.put('/api/subjects/'+id, $scope.subject).success(function(response){
			window.location.href='#/subjects';
		});
	}

	$scope.removeSubject = function(id){
		$http.delete('/api/subjects/'+id).success(function(response){
			window.location.href='#/subjects';
		});
	}

}]);