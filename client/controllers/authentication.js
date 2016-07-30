var myApp = angular.module('myApp');




myApp.controller('AuthCtrl', [
	'$scope',
	'auth',
	function($scope, auth){
	  $scope.user = {};

	  $scope.register = function(){
	    auth.register($scope.user).error(function(error){
	      $scope.error = error;
	      //console.log(error);
	    }).then(function(){
	      window.location.href='#/';
	    });
	  };

	  $scope.logIn = function(){
	    auth.logIn($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      window.location.href='#/';
	    });
	  };
	}]);




