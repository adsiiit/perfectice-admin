var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jwt = require('express-jwt');

//acts as middleware
var config = require('../config');
var auth = jwt({secret: config.secret, userProperty: 'payload'});


module.exports = app;

//to create json document
app.use(bodyParser.json());


//connect to database using mongojs
var mongojs = require('mongojs');
var db=mongojs(config.mongo.db,['KhanAcademy','mapping','subjects','topics','grades']);


// myid will store the id corresponding to the myperfectice topic id in Provider table.
var myid;
// requiredDocument will contain the document which will be matched with idInProvider.
var requiredDocument = {};

var videoList = [];

//this function will recursively search from the nested documents for the idByProvider.
function searching(document) {
	if("Children" in document && document["Children"].length!=0)
	{
		for(var j=0;j<document["Children"].length;j++)
		{
			//console.log(document["Children"][j]["_id"]);
			//console.log(document["Children"][j]);
			if(document["Children"][j]["_id"].toString() == myid.toString())
			{
				requiredDocument = document["Children"][j];
				return;
			}
			else
				searching(document["Children"][j]);

			//console.log(document["Children"][j]["_id"]);
		}
	}

}

//this function will process the document.
function processDocument(document)
{
	
	if(document["Children"].length!=0)
	{
		for(var j=0;j<document["Children"].length;j++)
		{
			if(document["Children"][j]["kind"].toString() == "Video")
			{
				//console.log(document);
				var x = {};
				x["title"] = document["Children"][j]["title"];
				x["description"] = document["Children"][j]["description"];
				x["youtubeId"] = document["Children"][j]["youtube_id"];
				videoList.push(x);
			}
			else
			{
				//console.log(document["kind"]);
				processDocument(document["Children"][j]);
			}
		}
	}
}

//this function will return the list of videos.
function getVideo(document)
{
	if(document["kind"] == "Video")
	{
		//console.log("executed if of getVideo");
		var x = {};
		x["title"] = document["title"];
		x["description"] = document["description"];
		x["youtubeId"] = document["youtube_id"];
		videoList.push(x);
		return;
	}
	else if(document["Children"].length!=0)
	{
		//console.log("executed else of getVideo");
		processDocument(document);
		return;
	}

}


//Pass it the providerId('Khan for current scenario') and perfecticeId of topic and it will return the videos associated with it.
app.get('/getVideosList/:prov/:id', function(req,res){
	db.mapping.findOne({"provider":req.params.prov,"perfecticeId":mongojs.ObjectId(req.params.id)},
		function(err, que){
		if(err)
			res.send(err);
		else if(que)
		{
			myid = que.providerId;
			//console.log(myid);
			db.KhanAcademy.find({}, function(err, que1){
				if(err)
					res.send(err);

				var x = {};
				for (var i=0; i < que1.length; i++)
				{
					searching(que1[i]);
				}
				//console.log(x);
				videoList = [];
				getVideo(requiredDocument);
				//res.json(requiredDocument);
				res.json(videoList);
			});
		}
		else
			res.json([]);
	});
});


app.get('/khanAcademy',auth, function(req,res){
	db.KhanAcademy.find({},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.post('/addMapping',auth,function(req,res){
	var map = req.body;
	//console.log(map);
	if(!map.perfecticeId || !map.providerId)
		res.json({"code": 500, "error": "Perfectice Id or Provider Id field is null.."})
	else
	{
		map.perfecticeId  = mongojs.ObjectId(map.perfecticeId);
		map.providerId  = mongojs.ObjectId(map.providerId);
		map.nameFromProvider = String(map.nameFromProvider);
		//console.log('else part');
		db.mapping.save(map,
			function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
	}
	
});

app.get('/mappingDocument/:perfecticeid/:providerId', function(req,res){
	db.mapping.findOne({perfecticeId: mongojs.ObjectId(req.params.perfecticeid), providerId: mongojs.ObjectId(req.params.providerId)},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

/*
app.put('/editMapping',auth,function(req,res){
	var map = req.body;
	console.log(map);
	if(!map.perfecticeId || !map.providerId)
	{
		//console.log('if part');
		res.json({"code": 500, "error": "Perfectice Id or Provider Id field is null.."})
	}
	else
	{
		map.perfecticeId  = mongojs.ObjectId(map.perfecticeId);
		map.providerId  = mongojs.ObjectId(map.providerId);
		map.nameFromProvider = String(map.nameFromProvider);
		//console.log('else part');
		db.mapping.findAndModify({
		    query: { perfecticeId: map.perfecticeId },
		    update: { $set: { providerId: map.providerId, nameFromProvider: map.nameFromProvider} },
		    new: true
		}, function (err, doc, lastErrorObject) {
		    if(err)
				res.send(err);
			res.json(doc);
		});
	}
	
});*/

app.delete('/deleteMapping/:perfecticeId/:providerId',auth,function(req,res){
	var providerId = req.params.providerId;
	var perfecticeId = req.params.perfecticeId;
	//console.log(providerId);
	if(!providerId || !perfecticeId)
	{
		console.log('if part');
		res.json({"code": 500, "error": "Provider or Perfectice Id field is null.."})
	}
	else
	{
		providerId  = mongojs.ObjectId(providerId);
		perfecticeId  = mongojs.ObjectId(perfecticeId);
		//console.log('else part');
		db.mapping.remove({ providerId: providerId, perfecticeId: perfecticeId},
			function (err, doc) {
		    if(err)
				res.send(err);
			res.json(doc);
		});
	}
});



//Perfectice Grades-Subjects-Topics Tree

app.get('/perfecticeTree', function(req,res){
	db.subjects.aggregate([
		{$lookup:{from: "grades", localField: "grade", foreignField: "_id", as:"gradedet"}},
		{$unwind: "$gradedet"},
		{$project: {name: 1, topics:1, "gradedet.name": 1, "gradedet._id": 1}},
		{$unwind: "$topics"},
		{$lookup:{from: "topics", localField: "topics", foreignField: "_id", as:"topicdet"}},
		{$unwind: "$topicdet"},
		{$project: {name: 1, "gradedet":1, "topicdet._id":1, "topicdet.name":1}},
		{$group: {_id: { _id: "$_id", name: "$name", grade: "$gradedet"},children: {$addToSet: "$topicdet"}}},
		{$project: {_id: "$_id._id", name:"$_id.name", grade:"$_id.grade", children:1, collapsed: {$literal: true}}},
        {$group: {_id: { _id: "$grade"},children: {$addToSet: {_id: "$_id", name:"$name",children:"$children", collapsed:"$collapsed"}}}},
		{$project: {_id: "$_id._id._id", name:"$_id._id.name", children:1, collapsed: {$literal: true}}},
		{$sort : {name : 1}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.get('/mappingTable', function(req,res){
	/*var provider = String(req.params.provider);*/
	db.mapping.aggregate([
/*			{$match: {"provider": provider}},*/
			{$lookup:{from: "topics", localField: "perfecticeId", foreignField: "_id", as:"topicdet"}},
			{$unwind: "$topicdet"},
			{$project: {provider: 1, topicId: "$topicdet._id", subjectId: "$topicdet.subject", topicName: "$topicdet.name", providerId: 1, nameFromProvider:1}},
			{$lookup:{from: "subjects", localField: "subjectId", foreignField: "_id", as:"subdet"}},
			{$unwind: "$subdet"},
			{$project: {provider: 1, topicId: 1, subjectId: "$topicdet.subject", topicName: 1,subjectName: "$subdet.name", providerId: 1, gradeId:"$subdet.grade", nameFromProvider:1}},
			{$lookup:{from: "grades", localField: "gradeId", foreignField: "_id", as:"gradedet"}},
			{$unwind: "$gradedet"},
			{$project: {provider: 1, providerId: 1, perfecticeId: "$topicId", topicName: 1,subjectName: 1, gradeName:"$gradedet.name", nameFromProvider:1}}
		],
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});



/*var requiredHierarchy = [];
var tempHierarchy = [];
//this function will recursively search from the nested documents and store hierarchy in requiredHierarchy variable
function searchHierarchyKhan(document) {
	
	if("Children" in document && document["Children"].length!=0)
	{
		tempHierarchy.push(document["title"]);
		if(document["_id"].toString() == myid.toString())
		{
			console.log("andar aaya");
			requiredHierarchy = tempHierarchy;
			return;
		}

		for(var j=0;j<document["Children"].length;j++)
		{

			searchHierarchyKhan(document["Children"][j]);

		}
	}
	else
	{
		tempHierarchy = [];
		return
	}
	

}


app.get('/getHierarchyKhan/:id', function(req,res){
	db.KhanAcademy.find({}, function(err, que){
		if(err)
			res.send(err);
		myid = req.params.id;

		for (var i=0; i < que.length; i++)
		{
			tempHierarchy.push(que[i]["title"]);
			searchHierarchyKhan(que[i]);
			tempHierarchy = [];

		}

		res.json(requiredHierarchy);
	});
});*/