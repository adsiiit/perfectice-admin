var myApp = angular.module('myApp');

myApp.controller('IntegrationController', ['$scope', '$http', '$location', '$routeParams','auth','$q',
	function($scope, $http, $location, $routeParams,auth, $q){
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
			//console.log(response);
		});
	}

	$scope.action1 = function(){	
			$scope.ssubject = null;
			$scope.stopic = null;
	}

	$scope.action2 = function(){	
			$scope.stopic = null;
			var responses = [];
			$scope.videosList = [];
			var promises = [];
			($scope.topics).forEach(function(d){
				if(d["subject"] == $scope.ssubject)
					promises.push($http.get('/api2/getVideosList/Khan/'+d._id, { headers: {Authorization: 'Bearer '+auth.getToken()}}))
			});
			$q.all(promises).then(function(results){
				results.forEach(function(data){
					var x = data["data"];
					if(x.length != 0)
						responses = responses.concat(x);
			    	
			  	})
			  	$scope.videosList = responses;
			  	//console.log(responses);
			})

	}




	$scope.action3 = function(){	
		$http.get('/api2/getVideosList/Khan/'+$scope.stopic, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.videosList = response;
		});
	}

	$scope.action4 = function(){	
		$scope.errorExists = null;
	}


/*	$scope.getKhanAcademy = function(){	
		$http.get('/api2/khanAcademy').success(function(response){
			$scope.khanAcademyArray = response;
		});
	}*/

	$scope.getMyPerfectice = function(){	
		$http.get('/api2/perfecticeTree').success(function(response){
			$scope.myPerfecticeArray = response;
		});
	}

	$scope.map = {};

	$scope.insertMap = function(){
		$http.post('/api2/addMapping', $scope.map, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$http.get('/api2/mappingTable/').success(function(response){
				$scope.mappingTable = response;
				$scope.map.providerId = null;
				$scope.map.perfecticeId = null;
				window.alert('Mapping Added..');
			});
		});
	}

/*	$scope.editMap = function(){
		$http.get('/api2/mappingDocument/'+$scope.map.perfecticeId).success(function(response){
			$scope.doc = response;
			$scope.errorExists = null;
			if(!response)
				$scope.errorExists = "This Topic doesn't exist";
			else
			{
				$http.put('/api2/editMapping', $scope.map, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
					window.alert('Mapping Modified..');
				});
			}
		});
		
	}*/

	$scope.deleteMap = function(perfecticeId, providerId){
		$http.get('/api2/mappingDocument/'+perfecticeId+'/'+providerId).success(function(response){
			$scope.doc = response;
			$scope.errorExists = null;
			if(!response)
				$scope.errorExists = "This Topic doesn't exist";
			else
			{
				//console.log($scope.map.perfecticeId);
				$http.delete('/api2/deleteMapping/'+perfecticeId+'/'+providerId, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
					$http.get('/api2/mappingTable/').success(function(response){
						$scope.mappingTable = response;
						//window.alert('Mapping Deleted..');
					});	
				});
			}
		});
		
	}

	$scope.mappingTable = function(){
		$http.get('/api2/mappingTable/').success(function(response){
			$scope.mappingTable = response;
		});
		
	}


	$scope.retrieveData = function(){
			if($scope.map.provider=='Khan')
			{
				$http.get('/api2/khanAcademy', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
					$scope.providerArray = response;
/*					$http.get('/api2/mappingTable/'+$scope.map.provider).success(function(response){
						$scope.mappingTable = response;
					});*/
					console.log("Khan is provider");
				});
			}
			else if($scope.map.provider=='NIIT')
			{
				$scope.providerArray = [];
/*				$http.get('/api2/mappingTable/'+$scope.map.provider).success(function(response){
					$scope.mappingTable = response;
				});*/
				console.log("NIIT is provider");
			}
		
	}




	$scope.$watch( 'providerTree.currentNode', function( newObj, oldObj ) {
	    if( $scope.providerTree && angular.isObject($scope.providerTree.currentNode) ) {
	    	$scope.map.providerId = $scope.providerTree.currentNode._id;
	    	$scope.map.nameFromProvider = $scope.providerTree.currentNode.title;
	        //console.log( 'Node Selected!!' );
	        console.log( $scope.providerTree.currentNode );
	    }
	}, false);

	$scope.$watch( 'perfecticeTree.currentNode', function( newObj, oldObj ) {
	    if( $scope.perfecticeTree && angular.isObject($scope.perfecticeTree.currentNode) ) {
	    	$scope.map.perfecticeId = $scope.perfecticeTree.currentNode._id;
	        //console.log( 'Node Selected!!' );
	        console.log( $scope.perfecticeTree.currentNode );
	    }
	}, false);


	$scope.isLoggedIn = auth.isLoggedIn;
/*	$scope.doSomething = function(id){
        $scope.kaid = id;
    }*/

}]);


