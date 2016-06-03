var myApp = angular.module('myApp');

myApp.controller('TopicsController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('Topics controller...');
	$scope.getTopics = function(){
		$http.get('/api/topics').success(function(response){
			$scope.topics = response;
		});
	}

	$scope.getSubjects = function(){
		$http.get('/api/subjects').success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getTopic = function(){
		var id = $routeParams.id;
		$http.get('/api/topics/'+id).success(function(response){
			$scope.topic = response;
		});
	}


	$scope.addTopic = function(){
		$http.post('/api/topics/', $scope.topic).success(function(response){
			window.location.href='#/topics';
		});
	}

	$scope.updateTopic = function(){
		var id = $routeParams.id;
		$http.put('/api/topics/'+id, $scope.topic).success(function(response){
			window.location.href='#/topics';
		});
	}

	$scope.removeTopic = function(id){
		$http.delete('/api/topics/'+id).success(function(response){
			window.location.href='#/topics';
		});
	}

}]);