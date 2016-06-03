var express = require('express');
var app = express();
var bodyParser = require('body-parser');

module.exports = app;

//to create json document
app.use(bodyParser.json());


//connect to database using mongojs

var mongojs = require('mongojs');
var db=mongojs("ProdDb",['students','classrooms','attempts','users','questions','grades','practicesets']);



//ALL ROUTES FOR QUERIES
app.get('/api/query1', function(req,res){
	db.classrooms.distinct("students", {}, function(err, id_list){
		if(err)
			res.send(err);
		db.students.aggregate(
			[
		{$match: {_id: {$in: id_list}, studentId:{$exists:false}}},
		{$lookup:{from: "users", localField: "createdBy", foreignField: "_id", as:"teacherdetail"}},
		{$unwind: "$teacherdetail"},
		{$project: {email: 1, teacher_id: "$teacherdetail._id", teacher_name: "$teacherdetail.name"}},
		{$group: {_id: "$teacher_name", Students: {$addToSet: "$email"}, count: {$sum: 1}}}
			], function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});


/*app.get('/api/query2', function(req,res){
	db.classrooms.distinct("students", {}, function(err, id_list){
		if(err)
			res.send(err);
		db.students.count({_id: {$in: id_list}, studentId:{$exists:false}}, function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});*/



app.get('/api/query3', function(req,res){
	db.attempts.distinct("user", {}, function(err, studentsattempt){
		if(err)
			res.send(err);
		db.users.aggregate([
			{$match: {_id: {$nin: studentsattempt}, role : "student"}},
			{$lookup:{from: "userlogs", localField: "_id", foreignField: "user", as:"userlog"}},
			{$project: {name: 1, last_login: {$max: "$userlog.updatedAt"}}}
			], function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});


app.get('/api/query4', function(req,res){
	db.attempts.distinct("user", {}, function(err, studentsattempt){
		if(err)
			res.send(err);
		db.users.count({_id: {$nin: studentsattempt}, role : "student"}, function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});



app.get('/api/query5', function(req,res){
	db.attempts.aggregate([
		{$project: {user: 1, studentName: 1, email: 1, updatedAt: 1, isAbandoned: 1}},
		{$sort: {user: 1, createdAt: 1}},
		{$group: {_id:"$user", last: {$last:"$$ROOT"}, count: {$sum: 1}}},
		{$match: {"last.isAbandoned": true}},
		{$project: {
		 _id: 0,
		user:"$last.user",
		studentName: "$last.studentName",
		email: "$last.email",
		last_attempt: "$last.updatedAt",
		no_of_attempts: "$count"
		}}], function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



app.get('/api/query6', function(req,res){
	db.attempts.aggregate([
		{$unwind: "$practiceSetInfo.grades"},
		{$group: {_id: "$practiceSetInfo.grades.name",No_of_attempts: {$sum : 1}, Students_attempted: {$addToSet: "$studentName"}}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



app.get('/api/query7', function(req,res){
	db.questions.aggregate({$group: {_id: "$subject.name",No_of_questions: {$sum : 1}, Questions: {$addToSet: "$questionHeader"}}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query8', function(req,res){
	db.questions.aggregate({$group: {_id: "$subject.name",No_of_questions: {$sum : 1}}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query9', function(req,res){
	db.questions.aggregate({$group: {_id: "$topic.name",No_of_questions: {$sum : 1}}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



app.get('/api/query10', function(req,res){
	db.grades.aggregate([
		{$unwind: "$subjects"},
		{$lookup:{from: "questions", localField: "subjects", foreignField: "subject._id", as:"questionsforexam"}},
		{$project: {name: 1, numberofquestions: {$size: "$questionsforexam"}}},
		{$group: {_id: "$name", totalquestions: {$sum: "$numberofquestions"}}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});




app.get('/api/query11', function(req,res){
	db.practicesets.aggregate([{$unwind: "$grades"},
	{$group: {_id: "$grades.name",No_of_sets: {$sum : 1}, practicesets: {$addToSet: "$title"}}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query12', function(req,res){
	db.attempts.aggregate([{$match:{
          "createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*30)}
    }},
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day"},
          "count":{$sum:1}
    }}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query13', function(req,res){
	db.attempts.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*30)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query14', function(req,res){
	db.attempts.aggregate([
    {$match:{"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*7)}}}, 
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"},
          "weekday": {$dayOfWeek: "$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day", weekday: "$weekday"},
          "count":{$sum:1}
      }}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query15', function(req,res){
	db.attempts.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*7)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query16', function(req,res){
	db.attempts.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query17', function(req,res){
	db.students.aggregate([{$match:{
          "createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24)}
    }},
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day"},
          "count":{$sum:1}
    }}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.get('/api/query18', function(req,res){
	db.students.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query19', function(req,res){
	db.students.aggregate([
    {$match:{"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*7)}}}, 
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"},
          "weekday": {$dayOfWeek: "$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day", weekday: "$weekday"},
          "count":{$sum:1}
      }}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query20', function(req,res){
	db.students.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*7)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.get('/api/query21', function(req,res){
	db.students.aggregate([{$match:{
          "createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*30)}
    }},
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day"},
          "count":{$sum:1}
    }}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query22', function(req,res){
	db.students.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*30)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});