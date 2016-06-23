var myApp = angular.module('myApp');

myApp.controller('CommonController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('Common controller...');

	$scope.text="Home Page";

}]);