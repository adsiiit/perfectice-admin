var myApp = angular.module('myApp');

myApp.controller('GradesController', ['$scope', '$http', '$location', '$routeParams', 'Slug', 
	function($scope, $http, $location, $routeParams, Slug){
	console.log('Grades controller...');

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
			$scope.st = response.status;
			//console.log(response);
				if($scope.st==false)
					$scope.sta = 'Enable';
				else
					$scope.sta = 'Disable';
		});
	}


	$scope.addGrade = function(){
		($scope.grade).slugfly = Slug.slugify(($scope.grade).name);
		
		$http.get('/api/grades/slugfly/'+($scope.grade).slugfly).success(function(response){
			if(response)
			{
				$scope.err = "Exam Name already exists..";
			}
			else
			{
				$http.post('/api/grades/', $scope.grade).success(function(response){
					window.location.href='#/master_data';
				});
			}
			

		});

	}

	$scope.updateGrade = function(){
		var id = $routeParams.id;
		($scope.exam).slugfly = Slug.slugify(($scope.exam).name);

		$http.get('/api/grades/slugfly/'+($scope.exam).slugfly).success(function(response){
			if(response)
			{
				$scope.err = "Exam Name already exists..";
			}
			else
			{
				$http.put('/api/grades/'+id, $scope.exam).success(function(response){
					window.location.href='#/master_data';
				});
			}
			

		});
	}

	$scope.removeGrade = function(id){
		$http.delete('/api/grades/'+id).success(function(response){
			window.location.href='#/master_data';
		});
	}


	$scope.updateStatus = function(){
		var id = $routeParams.id;
		if($scope.st==true)
		{
			$scope.st = false;
			$scope.sta = 'Enable';
		}
		else
		{
			$scope.st = true;
			$scope.sta = 'Disable';
		}
		var status = $scope.st;
		$http({
			    method: 'PUT', 
			    url: '/api/query40/'+id,
			    data:{
			        'status': status
			    }
			}).success(function(response){
			console.log('status update done');
		});
	
	}


}]);

