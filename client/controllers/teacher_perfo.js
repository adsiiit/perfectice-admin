var myApp = angular.module('myApp');

myApp.controller('TeacherPerfoController', ['$scope', '$http', 'orderByFilter','$location', '$routeParams',
	function($scope, $http, orderBy, $location, $routeParams){
	console.log('Teacher Performance controller...');


	$scope.options = {
            chart: {
                type: 'pieChart',
                height: 560,
                width: 560,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                "showLegend": true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                "labelType":"percent",
                "donut": false,
                legend: {
                    margin: {
                        top: 5,
                        right: 0,
                        bottom: 5,
                        left: 0
                    }
                }
            },
            
/*            "title":{
              "enable":true,
              "text":"Question Distribution",
              "className":"h4",
              "css":{"width":"nullpx",
              "textAlign":"center"}}*/
        };


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

	

	$scope.getTeacher = function(){
		var id = $routeParams.id;
		$http.get('/api/query1/'+id).success(function(response){
			$scope.teacherdetail=response;
		});
	}

	$scope.getSignedCount = function(){
		var id = $routeParams.id;
		$http.get('/api/query2/'+id).success(function(response){
			if(response)
				$scope.signcount = response.count;
			else
				$scope.signcount = 0;
		});
	}

    $scope.getAttemptedCount = function(){
        var id = $routeParams.id;
        $http.get('/api/query20/'+id).success(function(response){
            if(response)
                $scope.attemptedcount = response.count;
            else
                $scope.attemptedcount = 0;
        });
    }

	$scope.getTeacherQ = function(){
		var id = $routeParams.id;
		$http.get('/api/query14/'+id).success(function(response){
			var subs = response;
			var chartData = [];
			for(i=0;i<subs.length;i++)
			{
				var temp = {key: subs[i].subject, y: parseInt(subs[i].questionsCount)}
				chartData.push(temp);
			}

			$scope.data = chartData;
		});
	}


    $scope.getStuNotReg = function(){
        var id = $routeParams.id;
        $http.get('/api/query21/'+id).success(function(response){
                $scope.studentsList1 = orderBy(response, '_id');
                /*$scope.studentsList = response;*/


                $scope.maxSize1 = 5;
                $scope.TotalItems1 = response.length;
                $scope.currentPage1= 1;

        });
    }

    $scope.stuRegNotAttempt = function(){
        var id = $routeParams.id;
        $http.get('/api/query22/'+id).success(function(response){
                $scope.studentsList2 = orderBy(response, 'name');
                /*$scope.studentsList = response;*/


                $scope.maxSize2 = 5;
                $scope.TotalItems2 = response.length;
                $scope.currentPage2 = 1;

        });
    }


    $scope.lastAttempt = function(){
        var id = $routeParams.id;
        $http.get('/api/query17/'+id).success(function(response){
                $scope.studentsList3 = orderBy(response, 'name');
                /*$scope.studentsList = response;*/


                $scope.maxSize3 = 5;
                $scope.TotalItems3 = response.length;
                $scope.currentPage3 = 1;

        });
    }


}]);








myApp.directive('showTab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                jQuery(element).tab('show');
            });
        }
    };
});



myApp.directive('bsActiveLink', ['$location', function ($location) {
return {
    restrict: 'A', //use as attribute 
    replace: false,
    link: function (scope, elem) {
        //after the route has changed
        scope.$on("$routeChangeSuccess", function () {
            var hrefs = ['/#' + $location.path(),
                         '#' + $location.path(), //html5: false
                         $location.path()]; //html5: true
            angular.forEach(elem.find('a'), function (a) {
                a = angular.element(a);
                if (-1 !== hrefs.indexOf(a.attr('href'))) {
                    a.parent().addClass('active');
                } else {
                    a.parent().removeClass('active');   
                };
            });     
        });
    }
}
}]);