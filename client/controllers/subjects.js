var myApp = angular.module('myApp');

myApp.controller('SubjectsController', ['$scope', '$http', '$location', '$routeParams','Slug',
	function($scope, $http, $location, $routeParams, Slug){
	console.log('Subjects controller...');
	
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

	$scope.getSubjects = function(){
		$http.get('/api/query30').success(function(response){
			$scope.subjects = response;
		});
	}

	$scope.getSubjectsWOC = function(){
		$http.get('/api/subjects').success(function(response){
			$scope.subjects = response;

		});
	}	

	$scope.getGrades = function(){
		$http.get('/api/grades').success(function(response){
			$scope.grades = response;
		});
	}



	$scope.getTopics = function(){
		$http.get('/api/topics').success(function(response){
			$scope.topics = response;
		});
	}

	$scope.getTopicsWQC = function(){
		$http.get('/api/query32').success(function(response){
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
		$http.get('/api/subjects/'+id).success(function(response){
			$scope.subject = response;
		});
	}


	$scope.addSubject = function(){
		($scope.subject).slugfly = Slug.slugify(($scope.subject).name);
		$http.post('/api/subjects/', $scope.subject).success(function(response){
			window.location.href='#/master_data';
		});
	}

	$scope.updateSubject = function(){
		var id = $routeParams.id;
		($scope.subject).slugfly = Slug.slugify(($scope.subject).name);
		$http.put('/api/subjects/'+id, $scope.subject).success(function(response){
			window.location.href='#/master_data';
		});
	}

	$scope.removeSubject = function(id){
		$http.delete('/api/subjects/'+id).success(function(response){
			window.location.href='#/master_data';
		});
	}


	$scope.getGrade = function(){
		var par = $routeParams.id;
		var subject = {"grade": par}
		$scope.subject = subject
	}	


}]);


