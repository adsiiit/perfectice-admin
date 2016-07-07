var myApp = angular.module('myApp');

myApp.controller('TopicsController', ['$scope', '$http', '$location', '$routeParams', 'Slug',
	function($scope, $http, $location, $routeParams, Slug){
	console.log('Topics controller...');
	$scope.getTopics = function(){
		$http.get('/api/query32').success(function(response){
			$scope.topics = response;
		});
	}

	$scope.getTopicsWOC = function(){
		$http.get('/api/topics').success(function(response){
			$scope.topics = response;
		});
	}


	$scope.getSubjects = function(){
		$http.get('/api/subjects').success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getSubjectName = function(){
		var id = $routeParams.id;
		$http.get('/api/subjects/'+id).success(function(response){
			$scope.subjectName = response.name;
		});
	}


	$scope.getTopic = function(){
		var id = $routeParams.id;
		$http.get('/api/topics/'+id).success(function(response){
			$scope.topic = response;
			$http.get('/api/subjects/'+response.subject).success(function(response){
			$scope.subjectName = response.name;
			});
		});
	}


	$scope.addTopic = function(){
		var id = $routeParams.id;
		($scope.topic).subject = String(id);
		($scope.topic).slugfly = Slug.slugify(($scope.topic).name);
		$http.post('/api/topics/', $scope.topic).success(function(response){
			window.location.href='#/master_data';
		});
	}

	$scope.updateTopic = function(){
		var id = $routeParams.id;
		($scope.topic).slugfly = Slug.slugify(($scope.topic).name);
		$http.put('/api/topics/'+id, $scope.topic).success(function(response){
			window.location.href='#/master_data';
		});
	}

	$scope.removeTopic = function(id){
		$http.delete('/api/topics/'+id).success(function(response){
			window.location.href='#/master_data';
		});
	}


}]);