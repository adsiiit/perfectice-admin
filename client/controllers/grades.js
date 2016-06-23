var myApp = angular.module('myApp');

myApp.controller('GradesController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams){
	console.log('Grades controller...');

	$scope.options = {
            chart: {
                type: 'pieChart',
                height: 560,
                width: 560,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                "showLegend": false,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                "labelType":"percent",
                "donut": true,
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

	$scope.getGrades = function(){
		$http.get('/api/grades').success(function(response){
			$scope.exams = response;
			
		});
	}

	$scope.getSubjects = function(){
		$http.get('/api/subjects').success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getSubjectsWQC = function(){
		$http.get('/api/query30').success(function(response){
			$scope.subjects = response;


		    var subs = response;
		    var chartData = [];
		    var exam = $scope.exam;

			  for(i=0; i<subs.length; i++)
			  {	
			  	if((exam.subjects).indexOf(subs[i]._id)!=-1){	
			      var temp = {key: subs[i].name, y: parseInt(subs[i].questionsCount)}

			      chartData.push(temp);
			  	}
			  }

		    console.log(chartData);
		    $scope.data = chartData;


		});
	}

	$scope.getGrade = function(){
		var id = $routeParams.id;
		$http.get('/api/grades/'+id).success(function(response){
			$scope.exam = response;
		});
	}


	$scope.addGrade = function(){
		$http.post('/api/grades/', $scope.grade).success(function(response){
			window.location.href='#/grades';
		});
	}

	$scope.updateGrade = function(){
		var id = $routeParams.id;
		$http.put('/api/grades/'+id, $scope.exam).success(function(response){
			window.location.href='#/grades';
		});
	}

	$scope.removeGrade = function(id){
		$http.delete('/api/grades/'+id).success(function(response){
			window.location.href='#/grades';
		});
	}


}]);