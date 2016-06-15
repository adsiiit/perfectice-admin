var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens


//to create json document
app.use(bodyParser.json());



//connect to database using mongojs

var mongojs = require('mongojs');
var db=mongojs("ProdDb",['students','classrooms','attempts','users','questions','grades','practicesets','topics','subjects']);


/* **************************************************************  */

/* **************************************************************  */
/*INTEGRATION PART WITH NIIT -- STARTS */



app.get('/api/practiceSets', function(req,res){
	db.practicesets.find({"status" : "published"},{studentEmails: 0, classRooms:0, inviteeEmails:0, instructions:0, titleLower:0, user:0},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/api/AttemptSummary', function(req,res){
	db.attempts.aggregate([
			{"$project": {"year": {"$year": "$updatedAt"},"month": {"$month": "$updatedAt"},"day": {"$dayOfMonth": "$updatedAt"},
			_id: 1, practiceTestID: 1, createdAt: 1, totalQuestions: 1, totalTime: 1, totalMark: 1, totalCorrects: 1, totalErrors:1, totalMissed: 1, practicesetId: 1, email: 1
			}},

/*			{"$match": {"year": new Date().getFullYear(),"month": new Date().getMonth() ,"day": new Date().getDate()}},*/

			{$project: {_id: 0, attemptID: "$_id", email: "$email", practiceTestID:"$practicesetId", attemptDateTime: "$createdAt", questionCount: "$totalQuestions",
			  timeTaken: { $divide: [ "$totalTime", 1000.0] }, avgTime: { $divide: [{$divide: [ "$totalTime", "$totalQuestions"]},1000.0] }, totalMarks: "$totalMark", correctCount: "$totalCorrects",
			  incorrectCount: "$totalErrors", missedCount: "$totalMissed"
			  }}
			],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});





app.get('/api/gradesSubjectsTopics', function(req,res){
		db.subjects.aggregate([
			{$unwind: "$topics"},
			{$lookup:{from: "topics", localField: "topics", foreignField: "_id", as:"topicDetail"}},
			{$unwind: "$topicDetail"},
			{$project: {_id: 1, name:1, grade:1, updatedAt:1, createdAt:1, "topicDetail._id":1,
			  "topicDetail.name":1, "topicDetail.updatedAt":1, "topicDetail.createdAt":1}},
			{$group: {_id: { _id: "$_id", name: "$name",grade: "$grade", updatedAt: "$updatedAt",
			  createdAt: "$createdAt"}, "topics": {$addToSet: "$topicDetail"} }},
			  
			{$project: {_id: "$_id._id", name:"$_id.name", grade:"$_id.grade", updatedAt:"$_id.updatedAt", createdAt:"$_id.createdAt", topics:1}},
			
			{$lookup:{from: "grades", localField: "grade", foreignField: "_id", as:"gradeDetail"}},
			{$unwind:"$gradeDetail"},
			{$project: {_id: "$gradeDetail._id",countryCode: "$gradeDetail.countryCode", name:"$gradeDetail.name",
			  updatedAt:"$gradeDetail.updatedAt", createdAt:"$gradeDetail.createdAt", "subjectDetail._id":"$_id", 
			  "subjectDetail.name": "$name", "subjectDetail.updatedAt": "$updatedAt", "subjectDetail.createdAt": "$createdAt",
			  "subjectDetail.topics":"$topics"}},
			  
			{$group: {_id: { _id: "$_id", name: "$name", updatedAt: "$updatedAt",  createdAt: "$createdAt",
			  countryCode:"$countryCode"}, "subjects": {$addToSet: "$subjectDetail"} }},
			  
			 {$project: {_id: "$_id._id",countryCode: "$_id.countryCode", name:"$_id.name",
			  updatedAt:"$_id.updatedAt", createdAt:"$_id.createdAt", subjects: 1}}  

		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});





// MyPerfectice side TokenBased API's Starts


// get an instance of the router for api routes
var apiRoutes = express.Router(); 

module.exports = apiRoutes;

//route middleware to verify a token
apiRoutes.use(function(req,res,next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token) {
		jwt.verify(token, app.get('SecretKey'), function(err, decoded){
			if(err){
				return res.json({success: false, message:'Failed to authenticate token'});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else{
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});





// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/api/tokenInfo', function(req, res) {
	info = {name: req.decoded.name, email: req.decoded.email, examination: req.decoded.examination, country: req.decoded.country, phone: req.decoded.phone};
  res.json(info);
});





apiRoutes.get('/api/niitUser', function(req, res) {
	info = {name: req.decoded.name, email: req.decoded.email,
		examination: req.decoded.examination, country: req.decoded.country,
		phoneNumber: req.decoded.phone, provider: "niit"};
	User.findOneAndUpdate({email: info.email},{$set:{last_login:new Date().toISOString()}},
		function(err, que){
		if(err)
			res.send(err);
		if(que){
		/*	console.log(que._id);*/
			res.json(que._id);
		}
		else{
			newuser = User(info);
			newuser.save(function(err){
				if(err)
					res.send(err);
				res.json(newuser._id);
			});
		}
	});
});







/* **************************************************************  */

/* **************************************************************  */
/*INTEGRATION PART WITH NIIT -- STOPS */


module.exports = {
    app: app,
    apiRoutes: apiRoutes
};