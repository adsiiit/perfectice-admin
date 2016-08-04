var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jwt = require('express-jwt');

//acts as middleware
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


module.exports = app;

//to create json document
app.use(bodyParser.json());


//connect to database using mongojs

var mongojs = require('mongojs');
var db=mongojs("ProdDb",['students','classrooms','attempts','users','questions','grades','practicesets','topics','subjects']);



//ALL ROUTES FOR QUERIES


//Return id corresponding to email-id
app.get('/query0/:email', function(req,res){
	db.users.findOne({email: req.params.email },{_id:1},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


//List / count of students who are added to the classroom  -- Institute wise
app.get('/query1/:id', function(req,res){
	db.users.aggregate([
	{$match: {role:"teacher"}},
	{$lookup:{from: "students", localField: "_id", foreignField: "createdBy", as:"students"}},
	{$project: {name:1,email:1,students:1}},
	{$unwind: {path: "$students", preserveNullAndEmptyArrays: true}},
	{$project: {name:1, email:1,stu_email: "$students.email"}},
	{$group: {_id: {_id: "$_id", name: "$name", email: "$email"}, students: {$addToSet: "$stu_email"}}},
	{$project: {teacher_id: "$_id._id", teacher_name: "$_id.name", teacher_email: "$_id.email", count: {$size: "$students"}, _id:0}},
	{$match:{teacher_id: mongojs.ObjectId(req.params.id)}}
	], function(err, que){
		if(err)
			res.send(err);
		res.json(que[0]);
	});
});

//Count of students who are added to the classroom and registered as well -- Institute wise
app.get('/query2/:id', function(req,res){
	db.classrooms.distinct("students", {}, function(err, id_list){
		if(err)
			res.send(err);
		db.students.aggregate([
		{$match: {_id: {$in: id_list}}},
		{$lookup:{from: "users", localField: "email", foreignField: "email", as:"stuuser"}},
		{$unwind: "$stuuser"},
		{$lookup:{from: "users", localField: "createdBy", foreignField: "_id", as:"teacherdetail"}},
		{$unwind: "$teacherdetail"},
		{$project: {email: 1, teacher_id: "$teacherdetail._id", teacher_name: "$teacherdetail.name", teacher_email: "$teacherdetail.email"}},
		{$group: {_id:{teacher_id: "$teacher_id", teacher_name: "$teacher_name", teacher_email: "$teacher_email"}, Students: {$addToSet: "$email"}}},
		{$project: {_id: 0, teacher_id: "$_id.teacher_id", teacher_name: "$_id.teacher_name", teacher_email:"$_id.teacher_email", count: {$size: "$Students"}}},
		{$match:{teacher_id: mongojs.ObjectId(req.params.id)}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que[0]);
		});
			
		
	});
});



//Count of students who attempted  -- Institute wise
app.get('/query20/:id', function(req,res){
	db.classrooms.distinct("students", {}, function(err, id_list){
		if(err)
			res.send(err);
		db.students.aggregate([
			{$match: {_id: {$in: id_list}}},
			{$lookup:{from: "users", localField: "email", foreignField: "email", as:"stuuser"}},
			{$unwind: "$stuuser"},
			{$project: {email: 1, createdBy: 1, stuId: "$stuuser._id"}},
			{$match:{createdBy: mongojs.ObjectId(req.params.id)}},
			{$lookup:{from: "attempts", localField: "stuId", foreignField: "user", as:"attemptdet"}},
			{$project: {email: 1, createdBy: 1, stuId: 1, attempts: {$size: "$attemptdet"}}},
			{$match: {attempts: {$gte: 1}}},
			{$group: {_id:"$stuId", count: {$sum:1}}},
			{$group: {_id: null, count: {$sum:1}}},
			{$project: {count: 1, _id:0}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que[0]);
		});
			
		
	});
});


//List of Students not registered with classroom count-- institute wise
app.get('/query21/:id', function(req,res){
	db.users.distinct("email", {}, function(err, email_list){
		if(err)
			res.send(err);
		db.students.aggregate([
		{$match: {email: {$nin: email_list}}},
		{$lookup:{from: "users", localField: "createdBy", foreignField: "_id", as:"teacherdetail"}},
		{$unwind: "$teacherdetail"},
		{$project: {email: 1, createdAt:1,teacher_id: "$teacherdetail._id", teacher_name: "$teacherdetail.name", teacher_email: "$teacherdetail.email"}},
		{$group: {_id:{teacher_id: "$teacher_id", teacher_name: "$teacher_name", teacher_email: "$teacher_email"}, Students: {$push: {email: "$email", addedAt: "$createdAt"}}}},
		{$project: {_id: 0, teacher_id: "$_id.teacher_id", teacher_name: "$_id.teacher_name", teacher_email:"$_id.teacher_email", count: {$size: "$Students"}, Students: "$Students"}},
		{$match:{teacher_id: mongojs.ObjectId(req.params.id)}},
		{$unwind: "$Students"},
		{$group: {_id: "$Students.email", addedAt: {$min: "$Students.addedAt"},classroomCount: {$sum:1}}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});


//List of Students registered but not taken any test-- teacher wise
app.get('/query22/:id', function(req,res){
	db.users.distinct("email", {}, function(err, reg_list){
		if(err)
			res.send(err);
		db.attempts.distinct("email", {}, function(err, attempt_list){
			if(err)
				res.send(err);

			db.students.aggregate([
				{$match: {email: {$in: reg_list}}},
				{$match: {email: {$nin: attempt_list}}},
				{$match:{createdBy: mongojs.ObjectId(req.params.id)}},
				{$lookup:{from: "users", localField: "email", foreignField: "email", as:"userdetail"}},
				{$unwind: "$userdetail"},
				{$project: {email:1,name: "$userdetail.name",regdate: "$userdetail.createdAt",phone: "$userdetail.phoneNumber",gradesid:"$userdetail.grade",_id:0}},
				{$unwind: {path: "$gradesid", preserveNullAndEmptyArrays: true}},
				{$lookup:{from: "grades", localField: "gradesid", foreignField: "_id", as:"gradedetail"}},
				{$unwind: {path: "$gradedetail", preserveNullAndEmptyArrays: true}},
				{$project: {email:1,name: 1,regdate: 1,phone: 1,gradename:"$gradedetail.name",_id:0}},
				{$group: {_id: {email: "$email", name: "$name", regdate: "$regdate", phone: "$phone"},exams: {$addToSet: "$gradename"}}},
				{$project: {email:"$_id.email",name: "$_id.name",regdate: "$_id.regdate",phone: "$_id.phone",exams: "$exams",_id:0}}

			], function(err, que){
				if(err)
					res.send(err);
				console.log(que.length);
				res.json(que);
			});	
		});	
	});
});


//Last attempt report-- teacher wise
app.get('/query17/:id', function(req,res){
	db.users.distinct("email", {}, function(err, reg_list){
		if(err)
			res.send(err);
		db.attempts.distinct("email", {}, function(err, attempt_list){
			if(err)
				res.send(err);

			db.students.aggregate([
				{$match: {email: {$in: reg_list}}},
				{$match: {email: {$in: attempt_list}}},
				{$match:{createdBy: mongojs.ObjectId(req.params.id)}},
				{$lookup:{from: "users", localField: "email", foreignField: "email", as:"userdetail"}},
				{$unwind: "$userdetail"},
				{$project: {email:1,classRoom:1,name: "$userdetail.name",_id:0,id:"$userdetail._id",phone:"$userdetail.phoneNumber",gradesid:"$userdetail.grade"}},
				{$unwind: {path: "$gradesid", preserveNullAndEmptyArrays: true}},
				{$lookup:{from: "grades", localField: "gradesid", foreignField: "_id", as:"gradedetail"}},
				{$unwind: {path: "$gradedetail", preserveNullAndEmptyArrays: true}},
				{$project: {email:1,name: 1,id: 1,phone: 1,classRoom:1,gradename:"$gradedetail.name",_id:0}},
				{$group: {_id: {email: "$email", name: "$name", classRoom: "$classRoom",id:"$id", phone: "$phone"},exams: {$addToSet: "$gradename"}}},
				{$project: {email:"$_id.email",name: "$_id.name",classRoom: "$_id.classRoom",id:"$_id.id",phone: "$_id.phone",exams: "$exams",_id:0}},

				{$lookup:{from: "classrooms", localField: "classRoom", foreignField: "_id", as:"crdetail"}},
				{$unwind: {path: "$crdetail", preserveNullAndEmptyArrays: true}},
				{$project: {email:1,name: 1,id: 1,phone: 1,crname:"$crdetail.name",exams:1}},
				{$group: {_id: {email: "$email", name: "$name", exams: "$exams",id:"$id", phone: "$phone"},crooms: {$push: "$crname"}, count: {$sum: 1}}},
				{$project: {email:"$_id.email",name: "$_id.name",exams: "$_id.exams",id:"$_id.id",phone: "$_id.phone",crooms: "$crooms",count:1,_id:0}},
				{$lookup:{from: "attempts", localField: "id", foreignField: "user", as:"attemptdetail"}},
				{$project: {crooms:1,email:1,name: 1,count:1,phone:1,exams:1, lastAttempt: {$max: "$attemptdetail.createdAt"}}}
			], function(err, que){
				if(err)
					res.send(err);
				//console.log(que.length);
				res.json(que);
			});	
		});	
	});
});




app.get('/query3', function(req,res){
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


app.get('/query4', function(req,res){
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



app.get('/query5', function(req,res){
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



app.get('/query6', function(req,res){
	db.attempts.aggregate([
		{$unwind: "$practiceSetInfo.grades"},
		{$group: {_id: "$practiceSetInfo.grades.name",No_of_attempts: {$sum : 1}, Students_attempted: {$addToSet: "$studentName"}}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



app.get('/query7', function(req,res){
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


app.get('/query8', function(req,res){
	db.questions.aggregate({$group: {_id: "$subject.name",No_of_questions: {$sum : 1}}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/query9', function(req,res){
	db.questions.aggregate({$group: {_id: "$topic.name",No_of_questions: {$sum : 1}}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



app.get('/query10', function(req,res){
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




app.get('/query11', function(req,res){
	db.practicesets.aggregate([{$unwind: "$grades"},
	{$group: {_id: "$grades.name",No_of_sets: {$sum : 1}, practicesets: {$addToSet: "$title"}}}],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/query12/:n', function(req,res){
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


app.get('/query13/:n', function(req,res){
	db.attempts.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});





app.get('/query18/:n', function(req,res){
	db.students.count({"createdAt":{$gt: new Date(new Date().getTime() - 1000*60*60*24*req.params.n)}},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/query19/:n', function(req,res){
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




app.get('/query23', function(req,res){
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

app.get('/query24', function(req,res){
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




app.get('/query25', function(req,res){
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


app.get('/query26', function(req,res){
	db.users.count({role: "student"},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.get('/query27', function(req,res){
	db.attempts.distinct("user", {},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que.length);
	});
});

app.get('/query28', function(req,res){
	db.classrooms.distinct("students",{},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que.length);
	});
});




/*No. of questions by subject -- id is passed */

/*app.get('/query29/:_id', function(req,res){
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

app.get('/query30',auth, function(req,res){
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

app.get('/query31',auth, function(req,res){
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

app.get('/query32',auth, function(req,res){
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

app.get('/query33/:_id', function(req,res){
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

app.get('/query34/:n', function(req,res){
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
app.get('/query14/:id', function(req,res){
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
app.get('/query15/:id', function(req,res){
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
app.put('/query16/:id',auth, function(req,res){
	var s = req.body.status;
	db.users.update({_id:mongojs.ObjectId(req.params.id)},{$set:{status:s}}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});




//Trend of Attempts -- Teacher wise
app.get('/query35/:id', function(req,res){
	db.students.distinct("email", {}, function(err, stu_list){
		if(err)
			res.send(err);
		db.users.aggregate([
		{$match: {email: {$in: stu_list}}},
		{$project: {email:1}},
		{$lookup:{from: "students", localField: "email", foreignField: "email", as:"studetail"}},
		{$unwind: "$studetail"},
		{$match:{"studetail.createdBy": mongojs.ObjectId(req.params.id)}},
		{$project: {email:1}},
		{$group : {"_id" : "$_id"}},
		{$lookup:{from: "attempts", localField: "_id", foreignField: "user", as:"attemptdetail"}},
		{$unwind: "$attemptdetail"},
		{$project:{"year":{$year:"$attemptdetail.createdAt"}, 
		          "month":{$month:"$attemptdetail.createdAt"}, 
		          "day": {$dayOfMonth:"$attemptdetail.createdAt"}
		}}, 
		{$group:{
		      _id:{year:"$year", month:"$month", day:"$day"},
		       "count":{$sum:1}
		}},
		{$match:{
		          "_id.year": new Date().getFullYear(),
		          "_id.month": new Date().getMonth()
		    }},
		{$project: {month: "$_id.month", day: "$_id.day", count:1, _id: 0}},

		{$sort: {day: 1}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});



//Registration Trend  -- Teacher wise

app.get('/query36/:id', function(req,res){
	db.students.distinct("email", {}, function(err, stu_list){
		if(err)
			res.send(err);
		db.users.aggregate([
		{$match: {email: {$in: stu_list}}},
		{$project: {email:1,createdAt:1}},
		{$lookup:{from: "students", localField: "email", foreignField: "email", as:"studetail"}},
		{$unwind: "$studetail"},
		{$match:{"studetail.createdBy": mongojs.ObjectId(req.params.id)}},
		{$group : {"_id" : "$createdAt"}},
		{$project:{"year":{$year:"$_id"}, 
		          "month":{$month:"$_id"}, 
		          "day": {$dayOfMonth:"$_id"}
		}}, 
		{$group:{
		      _id:{year:"$year", month:"$month", day:"$day"},
		       "count":{$sum:1}
		}},
		{$match:{
		          "_id.year": new Date().getFullYear(),
		          "_id.month": new Date().getMonth()
		    }},
		{$project: {month: "$_id.month", day: "$_id.day", count:1, _id: 0}},
		{$sort: {day: 1}}
		], function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
			
		
	});
});


//Practice sets created – Institute wise

app.get('/query37/:id', function(req,res){
	db.practicesets.aggregate([
	
	{$project: {user:1,createdAt:1}},
	{$match: {user:mongojs.ObjectId(req.params.id)}},

	{$project:{"year":{$year:"$createdAt"}, 
	          "month":{$month:"$createdAt"}, 
	          "day": {$dayOfMonth:"$createdAt"}
	}}, 
	{$group:{
	      _id:{year:"$year", month:"$month", day:"$day"},
	       "count":{$sum:1}
	}},
	{$match:{
	          "_id.year": new Date().getFullYear(),
	          "_id.month": new Date().getMonth()
	    }},
	{$project: {month: "$_id.month", day: "$_id.day", count:1, _id: 0}},
	{$sort: {day: 1}}
	], function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});


//Trend of Questions added  -- Institute wise
app.get('/query38/:id', function(req,res){
	db.questions.aggregate([
	
	{$project: {user:1,createdAt:1}},
	{$match: {user:mongojs.ObjectId(req.params.id)}},

	{$project:{"year":{$year:"$createdAt"}, 
          "month":{$month:"$createdAt"}, 
          "day": {$dayOfMonth:"$createdAt"}
	}}, 
	{$group:{
	      _id:{year:"$year", month:"$month", day:"$day"},
	       "count":{$sum:1}
	}},
	{$match:{
	          "_id.year": new Date().getFullYear(),
	          "_id.month": new Date().getMonth()
	    }},
	{$project: {month: "$_id.month", day: "$_id.day", count:1, _id: 0}},
	{$sort: {day: 1}}
	], function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});



//Update the status of subject
app.put('/query39/:id',auth, function(req,res){
	var s = req.body.status;
	db.subjects.update({_id:mongojs.ObjectId(req.params.id)},{$set:{status:s}}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});

//Update the status of grade
app.put('/query40/:id',auth, function(req,res){
	var s = req.body.status;
	db.grades.update({_id:mongojs.ObjectId(req.params.id)},{$set:{status:s}}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});

//Update the status of topic
app.put('/query41/:id',auth, function(req,res){
	var s = req.body.status;
	db.topics.update({_id:mongojs.ObjectId(req.params.id)},{$set:{status:s}}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});




//Update the status of Practice Test -- published or withdrawn
app.put('/query42/:id',function(req,res){
	var s = req.body.status;
	//console.log(req.params.id);
	//console.log(s);
	var isodate = new Date().toISOString();
	console.log(isodate);
	db.practicesets.update({_id:mongojs.ObjectId(req.params.id)},{$set:{status:s, updatedAt:new Date(isodate)}}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});


//Get the practice sets
app.get('/query43',auth, function(req,res){
	db.practicesets.find({status: { $in: ["published", "withdrawn"] }}, {status:1, title:1, grades:1, userInfo:1}
	, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});

//Pass the practice set id and it will return it.
app.get('/query44/:id', function(req,res){
	db.practicesets.findOne({_id: mongojs.ObjectId(req.params.id)}
		, function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});	
});
