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
			$http.get('/api/grades/'+response.grade).success(function(response1){
			$scope.gradeName = response1.name;
			});
		});
	}


	$scope.getTopic = function(){
		var id = $routeParams.id;
		$http.get('/api/topics/'+id).success(function(response){
			$scope.topic = response;
			$scope.st = response.status;
			//console.log(response);
				if($scope.st==false)
					$scope.sta = 'Deactivate';
				else
					$scope.sta = 'Activate';
			$http.get('/api/subjects/'+response.subject).success(function(response){
				$scope.subjectName = response.name;
				$http.get('/api/grades/'+response.grade).success(function(response1){
				$scope.gradeName = response1.name;
				});
			});
		});
	}


/*	$scope.addTopic = function(){
		var id = $routeParams.id;
		($scope.topic).subject = String(id);
		($scope.topic).slugfly = Slug.slugify(($scope.topic).name);
		$http.post('/api/topics/', $scope.topic).success(function(response){
			window.location.href='#/master_data';
		});
	}*/


	$scope.addTopic = function(){
		var id = $routeParams.id;
		($scope.topic).subject = String(id);
		($scope.topic).slugfly = Slug.slugify(($scope.topic).name);
		$http.get('/api/subjects/'+id).success(function(response1){
			$scope.mysubject = response1;
			//console.log(response1.topics);
			$http.post('/api/topics/', $scope.topic).success(function(response){
				(($scope.mysubject).topics).push(response._id);
					$http.put('/api/subjects/'+response.subject, $scope.mysubject).success(function(response2){
						//console.log(response2.topics);
						window.location.href='#/subjects/details/'+response2._id;
					});
			});
		});

	}


	$scope.updateTopic = function(){
		var id = $routeParams.id;
		($scope.topic).slugfly = Slug.slugify(($scope.topic).name);
		$http.put('/api/topics/'+id, $scope.topic).success(function(response){
			window.location.href='#/subjects/details/'+response.subject;
		});
	}

	$scope.removeTopic = function(id){
		$http.delete('/api/topics/'+id).success(function(response){
			window.location.href='#/master_data';
		});
	}


	$scope.updateStatus = function(){
		var id = $routeParams.id;
		if($scope.st==true)
		{
			$scope.st = false;
			$scope.sta = 'Deactivate';
		}
		else
		{
			$scope.st = true;
			$scope.sta = 'Activate';
		}
		var status = $scope.st;
		$http({
			    method: 'PUT', 
			    url: '/api/query41/'+id,
			    data:{
			        'status': status
			    }
			}).success(function(response){
			console.log('status update done');
		});
	
	}

}]);