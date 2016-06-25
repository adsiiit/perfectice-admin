var myApp = angular.module('myApp', ['ngRoute', 'nvd3']);

myApp.config(function($routeProvider){
	$routeProvider.when('/', {
		controller: 'CommonController',
		templateUrl: 'views/home.html'
	})
	.when('/grades', {
		controller: 'GradesController',
		templateUrl: 'views/crud_for_set/grades.html'
	})
	.when('/grades/details/:id', {
		controller: 'GradesController',
		templateUrl: 'views/crud_for_set/grade_details.html'
	})
	.when('/grades/add', {
		controller: 'GradesController',
		templateUrl: 'views/crud_for_set/add_grade.html'
	})
	.when('/grades/edit/:id', {
		controller: 'GradesController',
		templateUrl: 'views/crud_for_set/edit_grade.html'
	})
	.when('/subjects', {
		controller: 'SubjectsController',
		templateUrl: 'views/crud_for_set/subjects.html'
	})
	.when('/subjects/details/:id', {
		controller: 'SubjectsController',
		templateUrl: 'views/crud_for_set/subject_details.html'
	})
	.when('/subjects/add/:id', {
		controller: 'SubjectsController',
		templateUrl: 'views/crud_for_set/add_subject.html'
	})
	.when('/subjects/edit/:id', {
		controller: 'SubjectsController',
		templateUrl: 'views/crud_for_set/edit_subject.html'
	})
	.when('/topics', {
		controller: 'TopicsController',
		templateUrl: 'views/crud_for_set/topics.html'
	})
	.when('/topics/details/:id', {
		controller: 'TopicsController',
		templateUrl: 'views/crud_for_set/topic_details.html'
	})
	.when('/topics/add/:id', {
		controller: 'TopicsController',
		templateUrl: 'views/crud_for_set/add_topic.html'
	})
	.when('/topics/edit/:id', {
		controller: 'TopicsController',
		templateUrl: 'views/crud_for_set/edit_topic.html'
	})
	.when('/stu_class_never_reg', {
		controller: 'QueriesIController',
		templateUrl: 'views/queries_i/stu_class_never_reg_I.html'
	})
	.when('/stu_reg_never_test', {
		controller: 'QueriesIController',
		templateUrl: 'views/queries_i/stu_reg_never_test_I.html'
	})
	.when('/stu_abon_never_test', {
		controller: 'QueriesIController',
		templateUrl: 'views/queries_i/stu_abon_never_test_I.html'
	})
	.when('/ques_by_subj_i', {
		controller: 'QueriesIController',
		templateUrl: 'views/queries_i/ques_by_subj_I.html'
	})
	.when('/ques_by_top_i', {
		controller: 'QueriesIController',
		templateUrl: 'views/queries_i/ques_by_top_I.html'
	})
	.when('/ques_by_exam_i', {
		controller: 'QueriesIController',
		templateUrl: 'views/queries_i/ques_by_exam_I.html'
	})
	.when('/ques_by_subj_ii', {
		controller: 'QueriesIIController',
		templateUrl: 'views/queries_ii/ques_by_subj_II.html'
	})
	.when('/ques_by_top_ii', {
		controller: 'QueriesIIController',
		templateUrl: 'views/queries_ii/ques_by_top_II.html'
	})
	.when('/ques_by_exam_ii', {
		controller: 'QueriesIIController',
		templateUrl: 'views/queries_ii/ques_by_exam_II.html'
	})
	.when('/stu_count_trend_ii', {
		controller: 'QueriesIIController',
		templateUrl: 'views/queries_ii/stu_count_trend_II.html'
	})
	.when('/attempt_count_trend_ii', {
		controller: 'QueriesIIController',
		templateUrl: 'views/queries_ii/attempt_count_trend_II.html'
	})
	.when('/srss_ii', {
		controller: 'QueriesIIController',
		templateUrl: 'views/queries_ii/srss_II.html'
	})



	.when('/master_data', {
		controller: 'MasterDataController',
		templateUrl: 'views/master_data/master1.html'
	})
	.when('/business_perfo', {
		controller: 'BusinessPerfoController',
		templateUrl: 'views/master_data/business_perfo.html'
	})



	.when('/test/:token', {
		controller: 'NIITController',
		templateUrl: 'views/niit/userinfo.html'
	})
	.otherwise({
		redirectTo: '/'
	})
});