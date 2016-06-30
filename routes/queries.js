var express = require('express');
var app = express();
var bodyParser = require('body-parser');

module.exports = app;

//to create json document
app.use(bodyParser.json());


//connect to database using mongojs

var mongojs = require('mongojs');
var db=mongojs("ProdDb",['students','classrooms','attempts','users','questions','grades','practicesets','topics','subjects']);



//ALL ROUTES FOR QUERIES


//Return id corresponding to email-id
app.get('/api/query0/:email', function(req,res){
	db.users.findOne({email: req.params.email },{_id:1},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


//List / count of students who are added to the classroom  -- Institute wise
app.get('/api/query1/:id', function(req,res){
	db.classrooms.distinct("students", {}, function(err, id_list){
		if(err)
			res.send(err);
		db.students.aggregate([
		{$match: {_id: {$in: id_list}}},
		{$lookup:{from: "users", localField: "createdBy", foreignField: "_id", as:"teacherdetail"}},
		{$unwind: "$teacherdetail"},
		{$project: {email: 1, teacher_id: "$teacherdetail._id", teacher_name: "$teacherdetail.name", teacher_email: "$teacherdetail.email"}},
		{$group: {_id:{teacher_id: "$teacher_id", teacher_name: "$teacher_name", teacher_email: "$teacher_email"}, Students: {$addToSet: "$email"}}},
		{$project: {_id: 0, teacher_id: "$_id.teacher_id", teacher_name: "$_id.teacher_name", teacher_email:"$_id.teacher_email", count: {$size: "$Students"}, Students: "$Students"}},
		{$match:{teacher_id: mongojs.ObjectId(req.params.id)}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que[0]);
		});
			
		
	});
});

//List / count of students who are added to the classroom and registered as well -- Institute wise
app.get('/api/query2/:id', function(req,res){
	db.classrooms.distinct("students", {}, function(err, id_list){
		if(err)
			res.send(err);
		db.students.aggregate([
		{$match: {_id: {$in: id_list}, studentId:{$exists:true}}},
		{$lookup:{from: "users", localField: "createdBy", foreignField: "_id", as:"teacherdetail"}},
		{$unwind: "$teacherdetail"},
		{$project: {email: 1, teacher_id: "$teacherdetail._id", teacher_name: "$teacherdetail.name", teacher_email: "$teacherdetail.email"}},
		{$group: {_id:{teacher_id: "$teacher_id", teacher_name: "$teacher_name", teacher_email: "$teacher_email"}, Students: {$addToSet: "$email"}}},
		{$project: {_id: 0, teacher_id: "$_id.teacher_id", teacher_name: "$_id.teacher_name", teacher_email:"$_id.teacher_email", count: {$size: "$Students"}, Students: "$Students"}},
		{$match:{teacher_id: mongojs.ObjectId(req.params.id)}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que[0]);
		});
			
		
	});
});



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
	db.questions.aggregate([
	{$lookup:{from: "users", localField: "user", foreignField: "_id", as:"userinfo"}},
	{$unwind: "$userinfo"},
	{$project: {teacher_name: "$userinfo.name", subject_name: "$subject.name"}},
	{$group: {_id: { teacher: "$teacher_name", subject: "$subject_name"}, No_of_questions: {$sum : 1}}},
	{$sort : {_id: 1} }
	],
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


app.get('/api/query12/:n', function(req,res){
	db.attempts.aggregate([{$match:{
          "createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}
    }},
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day"},
          "count":{$sum:1}
    }},
    {$sort: {_id: -1}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query13/:n', function(req,res){
	db.attempts.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});





app.get('/api/query18/:n', function(req,res){
	db.students.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query19/:n', function(req,res){
	db.students.aggregate([
    {$match:{"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}}}, 
    {$project:{
          "year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"},
          "weekday": {$dayOfWeek: "$createdAt"}
    }}, 
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day", weekday: "$weekday"},
          "count":{$sum:1}
      }},
    {$sort: {_id: -1}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});




app.get('/api/query23', function(req,res){
	db.questions.aggregate([
	{$lookup:{from: "users", localField: "user", foreignField: "_id", as:"userinfo"}},
	{$unwind: "$userinfo"},
	{$project: {teacher_name: "$userinfo.name", topic_name: "$topic.name"}},
	{$group: {_id: { teacher: "$teacher_name", topic: "$topic_name"}, No_of_questions: {$sum : 1}}},
	{$sort : {_id: 1} }
	],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.get('/api/query24', function(req,res){
	db.grades.aggregate([
	{$unwind: "$subjects"},
	{$lookup:{from: "questions", localField: "subjects", foreignField: "subject._id", as:"questionsforexam"}},
	{$unwind: "$questionsforexam"},
	{$project: {id: "$questionsforexam._id", _id:0, exam: "$name", teacher_id: "$questionsforexam.user"}},
	{$lookup:{from: "users", localField: "teacher_id", foreignField: "_id", as:"teacherinfo"}},
	{$unwind: "$teacherinfo"},
	{$project: {id: 1, exam: 1, teacher_name: "$teacherinfo.name"}},
	{$group: {_id: { teacher: "$teacher_name", exam: "$exam"}, No_of_questions: {$sum : 1}}},
	{$sort : {_id: 1} }

	],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});




app.get('/api/query25', function(req,res){
	db.students.aggregate([
	{$lookup:{from: "users", localField: "createdBy", foreignField: "_id", as:"teacherdetail"}},
	{$unwind: "$teacherdetail"},
	{$project: {email: 1, teacher_id: "$teacherdetail._id", teacher_name: "$teacherdetail.name"}},
	{$group: {_id:{teacher_id: "$teacher_id", teacher_name: "$teacher_name"}, Students: {$addToSet: "$email"}}},
	{$project: {_id: 0, teacher_name: "$_id.teacher_name", count: {$size: "$Students"}}}
	],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/query26', function(req,res){
	db.users.count({role: "student"},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.get('/api/query27', function(req,res){
	db.attempts.distinct("user", {},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que.length);
	});
});

app.get('/api/query28', function(req,res){
	db.classrooms.distinct("students",{},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que.length);
	});
});




/*No. of questions by subject -- id is passed */

/*app.get('/api/query29/:_id', function(req,res){
	db.questions.aggregate([
		{$group: {_id: {subId: "$subject._id", subName: "$subject.name"},No_of_questions: {$sum : 1}}},
		{$project: {_id: "$_id.subId", name: "$_id.subName", No_of_questions: "$No_of_questions"}},
		{$match: {_id: mongojs.ObjectId(req.params._id)}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que[0].No_of_questions);
	});
});
*/


/*Subjects with question count -- query30*/

app.get('/api/query30', function(req,res){
	db.subjects.aggregate([
		{$lookup:{from: "questions", localField: "_id", foreignField: "subject._id", as:"questionsforsubject"}},
		{$group: {_id: {_id: "$_id", slugfly: "$slugfly", countryCode: "$countryCode", name: "$name", updatedAt: "$updatedAt", createdAt: "$createdAt", topics: "$topics", grade: "$grade"},
		   questionsCount: {$sum: { $size: "$questionsforsubject" }}}},
		 {$project: {_id: "$_id._id", slugfly: "$_id.slugfly", name: "$_id.name", countryCode: "$_id.countryCode", topics: "$_id.topics", grade: "$_id.grade",
		  updatedAt: "$_id.updatedAt", createdAt: "$_id.createdAt", questionsCount: "$questionsCount"}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


/*Exams with question count -- query31*/

app.get('/api/query31', function(req,res){
	db.grades.aggregate([
		{$unwind: {path: "$subjects", preserveNullAndEmptyArrays: true}},
		{$lookup:{from: "questions", localField: "subjects", foreignField: "subject._id", as:"questionsforexam"}},
		{$group: {_id: {_id: "$_id", slugfly: "$slugfly", countryCode: "$countryCode", name: "$name", updatedAt: "$updatedAt", createdAt: "$createdAt"},
		  subjects: {$addToSet: "$subjects"}, questionsCount: {$sum: { $size: "$questionsforexam" }}}},
		 {$project: {_id: "$_id._id", slugfly: "$_id.slugfly", name: "$_id.name",countryCode: "$_id.countryCode",subjects: "$subjects", 
		  updatedAt: "$_id.updatedAt", createdAt: "$_id.createdAt", questionsCount: "$questionsCount"}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


/*Topics with question count -- query32*/

app.get('/api/query32', function(req,res){
	db.topics.aggregate([
		{$lookup:{from: "questions", localField: "_id", foreignField: "topic._id", as:"questionsfortopic"}},
		{$group: {_id: {_id: "$_id", slugfly: "$slugfly", name: "$name", updatedAt: "$updatedAt", createdAt: "$createdAt",subject: "$subject"},
		   questionsCount: {$sum: { $size: "$questionsfortopic" }}}},
		 {$project: {_id: "$_id._id", slugfly: "$_id.slugfly", name: "$_id.name", subject: "$_id.subject",
		  updatedAt: "$_id.updatedAt", createdAt: "$_id.createdAt", questionsCount: "$questionsCount"}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


/*Pass id and get email,name and phonenumber of all students who appeared in that practice set*/

app.get('/api/query33/:_id', function(req,res){
	db.practicesets.aggregate([
		{$lookup:{from: "attempts", localField: "_id", foreignField: "practicesetId", as:"setattempts"}},
		{$unwind: "$setattempts"},
		{$project: {_id: 1, attemptByUser: "$setattempts.user"}},
		{$lookup:{from: "users", localField: "attemptByUser", foreignField: "_id", as:"s_info"}},
		{$unwind: "$s_info"},
		{$project: {_id: 1, "s_info._id": 1, "s_info.name": 1, "s_info.email": 1, "s_info.phoneNumber": 1}},
		{$group: {_id: "$_id", Students_attempted: {$addToSet: "$s_info"}}},
		{$match: {_id: mongojs.ObjectId(req.params._id)}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



/*Signup Trend in last n days */

app.get('/api/query34/:n', function(req,res){
	db.users.aggregate([
		{$match:{
		          "createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}
		    }},
		    {$project:{
		          "year":{$year:"$createdAt"}, 
		          "month":{$month:"$createdAt"}, 
		          "day": {$dayOfMonth:"$createdAt"}
		    }}, 
		    {$group:{
		          _id:{year:"$year", month:"$month", day:"$day", weekday: "$weekday"},
		          "count":{$sum:1}
		    }},
		    {$sort: {_id: -1}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



//Questions count per subject  ~~~  teacher wise  ~~~  teacher-id is passed
app.get('/api/query14/:id', function(req,res){
	db.questions.aggregate([
	{$lookup:{from: "users", localField: "user", foreignField: "_id", as:"userinfo"}},
	{$unwind: "$userinfo"},
	{$project: {teacher_name: "$userinfo.name",teacher_id: "$userinfo._id", subject_name: "$subject.name"}},
	{$group: {_id: { teacher_id: "$teacher_id",teacher_name:"$teacher_name", subject: "$subject_name"}, No_of_questions: {$sum : 1}}},
	{$project: {_id: "$_id.teacher_id", teacher_name: "$_id.teacher_name", subject: "$_id.subject", questionsCount: "$No_of_questions"}},
	{$match: {_id: mongojs.ObjectId(req.params.id)}}
	], function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});



// Pass the _id of user and it will user detail along with last login and last attempt
app.get('/api/query15/:id', function(req,res){
	db.users.aggregate([
	{$match: {_id:mongojs.ObjectId(req.params.id)}},
	{$project: {name: 1, email:1, status: 1, createdAt: 1}},
	{$lookup:{from: "userlogs", localField: "_id", foreignField: "user", as:"userlog"}},
	{$project: {_id:1, name:1, email:1, status:1, createdAt: 1, last_login: {$max: "$userlog.updatedAt"}}},
	{$lookup:{from: "attempts", localField: "_id", foreignField: "user", as:"attemptlog"}},
	{$project: {_id:1, name:1, email:1, status:1, last_login:1, createdAt: 1, last_attempt: {$max: "$attemptlog.updatedAt"}}}
	], function(err, que){
		if(err)
			res.send(err);
		res.json(que[0]);
	});	
});



//Update the status of user
app.put('/api/query16/:id', function(req,res){
	var s = req.body.status;
	db.users.update({_id:mongojs.ObjectId(req.params.id)},{$set:{status:s}}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});


