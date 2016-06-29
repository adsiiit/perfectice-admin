var myApp = angular.module('myApp');

myApp.controller('UserManageController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('User Management controller...');

		$scope.getID = function(){
			var email = String($scope.emailid);
			$http.get('/api/query0/'+email).success(function(response){
				if(response)
				{
					var tid = response._id;
					window.location.href='#/teacher_perfo/'+tid;
				}
				else
					$scope.err = "*Email address is incorrect";
				
			});
		}
	




}]);
