var myApp = angular.module('myApp');

myApp.controller('NIITController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('NIIT controller...');

	$scope.userInfo = function(){
		var token = $routeParams.token;
		$http({
			    method: 'GET', 
			    url: '/api/niitUser',
			    headers:{
			        'x-access-token': token
			    }
			}).success(function(response){
			$scope.userinfo = response;
		});
	}


}]);