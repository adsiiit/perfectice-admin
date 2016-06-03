var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
	$routeProvider.when('/', {
		controller: 'CommonController',
		templateUrl: 'views/home.html'
	})
	.when('/grades', {
		controller: 'GradesController',
		templateUrl: 'views/grades.html'
	})
	.when('/grades/details/:id', {
		controller: 'GradesController',
		templateUrl: 'views/grade_details.html'
	})
	.when('/grades/add', {
		controller: 'GradesController',
		templateUrl: 'views/add_grade.html'
	})
	.when('/grades/edit/:id', {
		controller: 'GradesController',
		templateUrl: 'views/edit_grade.html'
	})
	.when('/subjects', {
		controller: 'SubjectsController',
		templateUrl: 'views/subjects.html'
	})
	.when('/subjects/details/:id', {
		controller: 'SubjectsController',
		templateUrl: 'views/subject_details.html'
	})
	.when('/subjects/add', {
		controller: 'SubjectsController',
		templateUrl: 'views/add_subject.html'
	})
	.when('/subjects/edit/:id', {
		controller: 'SubjectsController',
		templateUrl: 'views/edit_subject.html'
	})
	.when('/topics', {
		controller: 'TopicsController',
		templateUrl: 'views/topics.html'
	})
	.when('/topics/details/:id', {
		controller: 'TopicsController',
		templateUrl: 'views/topic_details.html'
	})
	.when('/topics/add', {
		controller: 'TopicsController',
		templateUrl: 'views/add_topic.html'
	})
	.when('/topics/edit/:id', {
		controller: 'TopicsController',
		templateUrl: 'views/edit_topic.html'
	})
	.otherwise({
		redirectTo: '/'
	})
})