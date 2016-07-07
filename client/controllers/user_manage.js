var myApp = angular.module('myApp');

myApp.controller('UserManageController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('User Management controller...');

		$scope.getID = function(){
			var email = String($scope.emailid);
			$http.get('/api/query0/'+email).success(function(response){
				if(response)
				{
					var uid = response._id;
					window.location.href='#/user_manage/'+uid;
				}
				else
					$scope.err = "*Email address is incorrect";
				
			});
		}
	
		$scope.getUser = function(){
			var id = $routeParams.id;
			$http.get('/api/query15/'+id).success(function(response){
				$scope.userdetail=response;
				$scope.st = response.status;
				if($scope.st==true)
					$scope.sta = 'Enabled';
				else
					$scope.sta = 'Disabled';
			});
		}

		$scope.updateStatus = function(){
			var id = $routeParams.id;
			if($scope.st==true)
			{
				$scope.st = false;
				$scope.sta = 'Disabled';
			}
			else
			{
				$scope.st = true;
				$scope.sta = 'Enabled';
			}
			var status = $scope.st;
			$http({
				    method: 'PUT', 
				    url: '/api/query16/'+id,
				    data:{
				        'status': status
				    }
				}).success(function(response){
				console.log('status update done');
			});
			
		}




}]);
