var myApp = angular.module('myApp');

myApp.controller('SubjectsController', ['$scope', '$http', '$location', '$routeParams','Slug','auth',
	function($scope, $http, $location, $routeParams, Slug,auth){
	console.log('Subjects controller...');
	
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

	$scope.getSubjects = function(){
		$http.get('/api/query30', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getSubjectsWOC = function(){
		$http.get('/api/subjects', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.subjects = response;

		});
	}	

	$scope.getGrades = function(){
		$http.get('/api/grades', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.grades = response;
		});
	}

	$scope.getGradeName = function(){
		var id = $routeParams.id;
		$http.get('/api/grades/'+id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.gradeName = response.name;
		});
	}




	$scope.getTopics = function(){
		$http.get('/api/topics', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.topics = response;
		});
	}

	$scope.getTopicsWQC = function(){
		$http.get('/api/query32', { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.topics = response;

			

		    var tops = response;
		    var chartData = [];
		    var subject = $scope.subject;

			  for(i=0; i<tops.length; i++)
			  {	
			  	if((subject.topics).indexOf(tops[i]._id)!=-1){	
			      var temp = {key: tops[i].name, y: parseInt(tops[i].questionsCount)}

			      chartData.push(temp);
			  	}
			  }

		    console.log(chartData);
		    $scope.data = chartData;

		});
	}


	$scope.getSubject = function(){
		var id = $routeParams.id;
		$http.get('/api/subjects/'+id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.subject = response;
			$scope.st = response.status;
			//console.log(response);
				if($scope.st==false)
					$scope.sta = 'Enable';
				else
					$scope.sta = 'Disable';
			$http.get('/api/grades/'+response.grade, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			$scope.gradeName = response.name;

			});
		});
	}


	$scope.addSubject = function(){
		var id = $routeParams.id;
		($scope.subject).slugfly = Slug.slugify(($scope.subject).name);
		($scope.subject).grade = String(id);

		$http.get('/api/subjects/slugfly/'+($scope.subject).slugfly, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			if(response)
			{
				$scope.err = "Subject Name already exists..";
			}
			else
			{
				$http.get('/api/grades/'+id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response1){
					//console.log(response1.countryCode);
					$scope.myexam = response1;
					($scope.subject).countryCode = String(response1.countryCode);
					//console.log(response1.subjects);
					$http.post('/api/subjects/', $scope.subject, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
						(($scope.myexam).subjects).push(response._id);
							$http.put('/api/grades/'+response.grade, $scope.myexam, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response2){
								//console.log(response2.subjects);
								window.location.href='#/grades/details/'+response2._id;
							});
					});
				});
			}
			

		});

		

	}

	$scope.updateSubject = function(){
		var id = $routeParams.id;
		($scope.subject).slugfly = Slug.slugify(($scope.subject).name);

		$http.get('/api/subjects/slugfly/'+($scope.subject).slugfly, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
			if(response)
			{
				$scope.err = "Subject Name already exists..";
			}
			else
			{
				$http.put('/api/subjects/'+id, $scope.subject, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
					window.location.href='#/grades/details/'+response.grade;
				});
			}
			

		});
	}

	$scope.removeSubject = function(id){
		$http.delete('/api/subjects/'+id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(response){
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
			    url: '/api/query39/'+id,
			    headers:{Authorization: 'Bearer '+auth.getToken()},
			    data:{
			        'status': status
			    }
			}).success(function(response){
			console.log('status update done');
		});
	
	}


}]);


