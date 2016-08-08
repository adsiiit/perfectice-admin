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

	$scope.action4 = function(){	
		$scope.errorExists = null;
	}

	$scope.getKhanAcademy = function(){	
		$http.get('/api2/khanAcademy').success(function(response){
			$scope.khanAcademyArray = response;
		});
	}

	$scope.getMyPerfectice = function(){	
		$http.get('/api2/perfecticeTree').success(function(response){
			$scope.myPerfecticeArray = response;
		});
	}

	$scope.map = {};

	$scope.insertMap = function(){
		$http.get('/api2/mappingDocument/'+$scope.map.perfecticeId).success(function(response){
			$scope.doc = response;
			$scope.errorExists = null;
			if(response)
				$scope.errorExists = 'This Topic is already mapped.';
			else
			{
				$http.post('/api2/addMapping', $scope.map).success(function(response){
					$http.get('/api2/mappingTable').success(function(response){
						$scope.mappingTable = response;
						window.alert('Mapping Added..');
					});
				});
			}
		});
		
	}

	$scope.editMap = function(){
		$http.get('/api2/mappingDocument/'+$scope.map.perfecticeId).success(function(response){
			$scope.doc = response;
			$scope.errorExists = null;
			if(!response)
				$scope.errorExists = "This Topic doesn't exist";
			else
			{
				$http.put('/api2/editMapping', $scope.map).success(function(response){
					window.alert('Mapping Modified..');
				});
			}
		});
		
	}

	$scope.deleteMap = function(id){
		$http.get('/api2/mappingDocument/'+id).success(function(response){
			$scope.doc = response;
			$scope.errorExists = null;
			if(!response)
				$scope.errorExists = "This Topic doesn't exist";
			else
			{
				//console.log($scope.map.perfecticeId);
				$http.delete('/api2/deleteMapping/'+id).success(function(response){
					$http.get('/api2/mappingTable').success(function(response){
						$scope.mappingTable = response;
						//window.alert('Mapping Deleted..');
					});	
				});
			}
		});
		
	}

	$scope.mappingTable = function(){
		$http.get('/api2/mappingTable').success(function(response){
			$scope.mappingTable = response;
		});
		
	}




	$scope.$watch( 'providerTree.currentNode', function( newObj, oldObj ) {
	    if( $scope.providerTree && angular.isObject($scope.providerTree.currentNode) ) {
	    	$scope.map.providerId = $scope.providerTree.currentNode._id;
	        console.log( 'Node Selected!!' );
	        console.log( $scope.providerTree.currentNode );
	    }
	}, false);

	$scope.$watch( 'perfecticeTree.currentNode', function( newObj, oldObj ) {
	    if( $scope.perfecticeTree && angular.isObject($scope.perfecticeTree.currentNode) ) {
	    	$scope.map.perfecticeId = $scope.perfecticeTree.currentNode._id;
	        console.log( 'Node Selected!!' );
	        console.log( $scope.perfecticeTree.currentNode );
	    }
	}, false);



/*	$scope.doSomething = function(id){
        $scope.kaid = id;
    }*/

}]);


