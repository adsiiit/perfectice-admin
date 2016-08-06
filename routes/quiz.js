var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var Quizattempt = mongoose.model('Quizattempt');
var jwt = require('express-jwt');

//acts as middleware
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


module.exports = app;

//to create json document
app.use(bodyParser.json());


//connect to database using mongojs
var mongojs = require('mongojs');
var db=mongojs("ProdDb",['attempts','users','questions','grades','practicesets','subjects','quizattempts','answers']);


//Quiz attempt of one question will be passed(user,questionId,quizId,timeTaken,answerId), it will verify the correctness 
//of answer and set the values of (plusMark, minusMark, score and missed) fields accordingly and then store it in 'quizattempts'
// collection as a document
app.post('/quizattempt',function(req,res){
	var quizattempt = req.body;
	var a,b;
	//console.log(quizattempt);
	db.answers.findOne({_id: mongojs.ObjectId(quizattempt.answerId)}
			, function(err, que){
			if(err)
				res.send(err);
			a = que;
			//console.log(a.question);
			if(a!=null)
			{
				if(quizattempt.questionId == a.question && a.isCorrectAnswer==true)
				{
					db.questions.findOne({_id: mongojs.ObjectId(quizattempt.questionId)},
						function(err, que1){
							if(err)
								res.send(err);
							b = que1;
							quizattempt.plusMark = b.plusMark;
							quizattempt.minusMark = 0;
							quizattempt.score = 1;
							quizattempt.missed = 0;

							Quizattempt.addQuizattempt(quizattempt, function(err, quizattempt){
								if(err){
									res.json({"code": 500, "error": "Some error has occured"});
								}
								res.json(quizattempt);
							});

							//console.log(quizattempt);
						});
					 
				}
				else if(quizattempt.questionId == a.question && a.isCorrectAnswer==false)
				{
					db.questions.findOne({_id: mongojs.ObjectId(quizattempt.questionId)},
						function(err, que1){
							if(err)
								res.send(err);
							b = que1;
							quizattempt.plusMark = 0;
							quizattempt.minusMark = b.minusMark;
							quizattempt.score = 0;
							quizattempt.missed = 0;

							Quizattempt.addQuizattempt(quizattempt, function(err, quizattempt){
								if(err){
									res.json({"code": 500, "error": "Some error has occured"});
								}
								res.json(quizattempt);
							});
							//console.log(quizattempt);
						});
				}
				else
				{
					res.json({"code": 500, "error": "Some error has occurred.."});
				}
				//console.log("fafafdas");
			}
			else
			{
				quizattempt.plusMark = 0;
				quizattempt.minusMark = 0;
				quizattempt.score = 0;
				quizattempt.missed = 1;

				Quizattempt.addQuizattempt(quizattempt, function(err, quizattempt){
					if(err){
						res.json({"code": 500, "error": "Some error has occured"});
					}
					res.json(quizattempt);
				});
				//res.json({"code": 500, "error": "answerId doesn't exists."});
			}
			
		});

});



//This endpoint returns the list of grades along with their subjects
app.get('/gradesWithSubjects', function(req,res){
	db.grades.aggregate([
	{$unwind: "$subjects"},
	{$lookup:{from: "subjects", localField: "subjects", foreignField: "_id", as:"subjectdet"}},
	{$unwind: "$subjectdet"},
	{$project: {_id: 1, name: 1, "subjectdet._id": 1, "subjectdet.name": 1}},
	{$group: {_id: {_id: "$_id", name: "$name"}, subjects: {$addToSet: "$subjectdet"}}},
	{$project: {_id: "$_id._id", name: "$_id.name", subjects: 1}}
	], function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



//Pass the userId, quizId & subjectId and it will return some random question(with options) which has not been already asked.
app.get('/randomQuestion/:user/:quizId/:subjectId', function(req,res){
	db.quizattempts.distinct("questionId",{"user":mongojs.ObjectId(req.params.user), "quizId" : mongojs.ObjectId(req.params.quizId)},
		function(err, id_list){
		if(err)
			res.send(err);
		db.questions.aggregate([
			{$match:{"subject._id": mongojs.ObjectId(req.params.subjectId)}},
			{$project: {plusMark: 1, minusMark: 1,questionHeader:1,questionText:1,
			  questionType:1,complexity:1}},
			 {$match: {_id: {$nin: id_list}}},
			 { $sample: {size: 1} },
			 {$lookup:{from: "answers", localField: "_id", foreignField: "question", as:"options"}},
             {$project: {plusMark: 1, minusMark: 1,questionHeader:1,questionText:1,questionType:1,complexity:1, "options._id":1, "options.answerText":1, "options.isCorrectAnswer":1}}
			], function(err, que){
			if(err)
				res.send(err);
			res.json(que[0]);
		});
	});
});


//Pass the subjectId and it will return some random question(with options).
app.get('/randomQuestionWOLogin/:subjectId', function(req,res){
		db.questions.aggregate([
			{$match:{"subject._id": mongojs.ObjectId(req.params.subjectId)}},
			{$project: {plusMark: 1, minusMark: 1,questionHeader:1,questionText:1,
			  questionType:1,complexity:1}},
			 { $sample: {size: 1} },
			 {$lookup:{from: "answers", localField: "_id", foreignField: "question", as:"options"}},
             {$project: {plusMark: 1, minusMark: 1,questionHeader:1,questionText:1,questionType:1,complexity:1, "options._id":1, "options.answerText":1, "options.isCorrectAnswer":1}}
			], function(err, que){
			if(err)
				res.send(err);
			res.json(que[0]);
		});
});



//Returns the options of given question(generally 4-5 options).
app.get('/questionOptions/:questionId', function(req,res){
	db.answers.find({"question" : mongojs.ObjectId(req.params.questionId)}, {answerText: 1, isCorrectAnswer:1},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


//Pass userid and quizid and it will return all the documents associated with it
app.get('/detailedSummary/:user/:quizId', function(req,res){
	db.quizattempts.find({"user" : mongojs.ObjectId(req.params.user), "quizId" : mongojs.ObjectId(req.params.quizId)},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

//Pass userid and quizid and it will return the summary.
app.get('/summary/:user/:quizId', function(req,res){
	db.quizattempts.aggregate([
	{$match: {"user" : mongojs.ObjectId(req.params.user), "quizId" : mongojs.ObjectId(req.params.quizId)}},
	{$project: {timeTaken:1, plusMark:1, minusMark:1, score:1, missed:1, _id: 0}},
	{$group: {_id: null, plusMarks: {$sum : "$plusMark"},minusMarks: {$sum : "$minusMark"},totalCorrect: {$sum : "$score"}, totalQuestions: {$sum: 1}, totalMissed: {$sum: "$missed"}}},
	{$project: {_id: 0, plusMarks:1, minusMarks:1, totalCorrect:1, totalQuestions:1, totalMissed: 1}}
	],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que[0]);
	});
});

