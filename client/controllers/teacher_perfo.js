var myApp = angular.module('myApp');

myApp.controller('TeacherPerfoController', ['$scope', '$http', 'orderByFilter','$location', '$routeParams',
	function($scope, $http, orderBy, $location, $routeParams){
	console.log('Teacher Performance controller...');

    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var d = new Date();
    $scope.month = months[d.getMonth()-1];


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






        $scope.optionsline = {
            chart: {
                type: 'lineChart',
                height: 300,
                width: 370,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: $scope.month
                },
                yAxis: {
                    axisLabel: ' ',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: false,
                text: 'Write your text and enable it'
            }
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
                for(i=0;i<response.length;i++)
                {
                    var d = new Date(($scope.studentsList1[i]).addedAt);
                    ($scope.studentsList1[i]).addedAt = d.toLocaleDateString();
                }

                $scope.maxSize1 = 5;
                $scope.TotalItems1 = response.length;
                $scope.currentPage1= 1;

        });
    }

    $scope.stuRegNotAttempt = function(){
        var id = $routeParams.id;
        $http.get('/api/query22/'+id).success(function(response){
                $scope.studentsList2 = orderBy(response, 'regdate', true);
                /*$scope.studentsList = response;*/
                for(i=0;i<response.length;i++)
                {
                    var d = new Date(($scope.studentsList2[i]).regdate);
                    ($scope.studentsList2[i]).regdate = d.toLocaleDateString();
                }

                $scope.maxSize2 = 5;
                $scope.TotalItems2 = response.length;
                $scope.currentPage2 = 1;

        });
    }


    $scope.lastAttempt = function(){
        var id = $routeParams.id;
        $http.get('/api/query17/'+id).success(function(response){
                $scope.studentsList3 = orderBy(response, 'lastAttempt', true);
                /*$scope.studentsList = response;*/
                for(i=0;i<response.length;i++)
                {
                    var d = new Date(($scope.studentsList3[i]).lastAttempt);
                    ($scope.studentsList3[i]).lastAttempt = d.toLocaleDateString();
                }

                $scope.maxSize3 = 5;
                $scope.TotalItems3 = response.length;
                $scope.currentPage3 = 1;

        });
    }



    /* Attempts trend last month*/
    $scope.attemptsTrend = function(){
        var id = $routeParams.id;
        $http.get('api/query35/'+id).success(function(response){
            var trend = response;
            var chartData = [];

            

              for(i=0,j=0; i<31 ; i++)
              {

                  if(j<trend.length && trend[j].day==i+1)
                    {
                        chartData.push({x: i+1 , y: trend[j].count});
                        j++;
                    }
                  else
                  chartData.push({x: i+1 , y: 0});
              }
            //console.log(chartData);
            $scope.dataAttempt = [{
                    values: chartData,    
                    key: 'Attempts',
                    color: '#d9534f',  
                }];
        });
    }


    /* Registration trend last month*/
    $scope.registrationTrend = function(){
        var id = $routeParams.id;
        $http.get('api/query36/'+id).success(function(response){
            var trend = response;
            var chartData = [];

            

              for(i=0,j=0; i<31 ; i++)
              {

                  if(j<trend.length && trend[j].day==i+1)
                    {
                        chartData.push({x: i+1 , y: trend[j].count});
                        j++;
                    }
                  else
                  chartData.push({x: i+1 , y: 0});
              }
            //console.log(chartData);
            $scope.dataRegistration = [{
                    values: chartData,    
                    key: 'Registration',
                    color: '#1ca0c3',  
                }];
        });
    }

    /* Practice sets created trend last month*/
    $scope.practiceTestTrend = function(){
        var id = $routeParams.id;
        $http.get('api/query37/'+id).success(function(response){
            var trend = response;
            var chartData = [];

            

              for(i=0,j=0; i<31 ; i++)
              {

                  if(j<trend.length && trend[j].day==i+1)
                    {
                        chartData.push({x: i+1 , y: trend[j].count});
                        j++;
                    }
                  else
                  chartData.push({x: i+1 , y: 0});
              }
            //console.log(chartData);
            $scope.dataPractice = [{
                    values: chartData,    
                    key: 'Practice Tests',
                    color: '#d9534f',  
                }];
        });
    }

    /* Questions added trend last month*/
    $scope.questionsTrend = function(){
        var id = $routeParams.id;
        $http.get('api/query38/'+id).success(function(response){
            var trend = response;
            var chartData = [];

            

              for(i=0,j=0; i<31 ; i++)
              {

                  if(j<trend.length && trend[j].day==i+1)
                    {
                        chartData.push({x: i+1 , y: trend[j].count});
                        j++;
                    }
                  else
                  chartData.push({x: i+1 , y: 0});
              }
            
            $scope.dataQuestions = [{
                    values: chartData,    
                    key: 'Questions',
                    color: '#1ca0c3',  
                }];
            //console.log($scope.dataQuestions);
        });
    }







}]);



