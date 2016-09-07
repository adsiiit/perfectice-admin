var myApp = angular.module('myApp');

myApp.controller('PTController', ['$scope', '$http', '$location', '$routeParams','auth','orderByFilter',
	function($scope, $http, $location, $routeParams,auth,orderBy){
	console.log('Practice Test Management controller...');

		$scope.getPTs = function(){
			$http.get('/api/query43',{ headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){

				$scope.practicesets = orderBy(response, 'title');
				$scope.maxSize = 5;
                $scope.TotalItems = response.length;
                $scope.page= 1;
			});
		}

		$scope.getPT = function(){
			var id = $routeParams.id;
			$http.get('/api/query44/'+id).success(function(response){
				$scope.practiceset=response;
				$scope.st = response.status;
				if($scope.st=="published")
					$scope.sta = 'Withdraw';
				else
					$scope.sta = 'Re-Publish';
			});
		}
	
		$scope.updateStatus = function(){
			var id = $routeParams.id;
			if($scope.st=="published")
			{
				$scope.st = "withdrawn";
				$scope.sta = 'Re-Publish';
			}
			else if($scope.st=="withdrawn")
			{
				$scope.st = "published";
				$scope.sta = 'Withdraw';
			}
			var status = $scope.st;
			$http({
				    method: 'PUT', 
				    url: '/api/query42/'+id,
				    headers: {Authorization: 'Bearer '+auth.getToken()},
				    data:{
				        'status': status
				    }
				}).success(function(response){
				console.log('status update done');
			});
			
		}


		$scope.isLoggedIn = auth.isLoggedIn;


}]);

