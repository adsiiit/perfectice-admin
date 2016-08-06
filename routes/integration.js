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
var db=mongojs("ProdDb",['KhanAcademy','mapping']);


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


app.get('/khanAcademy', function(req,res){
	db.KhanAcademy.find({},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});

app.post('/addMapping',function(req,res){
	var map = req.body;
	//console.log(map);
	if(!map.perfecticeId || !map.providerId)
		res.json({"code": 500, "error": "Perfectice Id or Provider Id field is null.."})
	else
	{
		map.perfecticeId  = mongojs.ObjectId(map.perfecticeId);
		map.providerId  = mongojs.ObjectId(map.providerId);
		//console.log('else part');
		db.mapping.save(map,
			function(err, que){
			if(err)
				res.send(err);
			res.json(que);
		});
	}
	
});

app.get('/mappingDocument/:id', function(req,res){
	db.mapping.findOne({perfecticeId: mongojs.ObjectId(req.params.id)},
		function(err, que){
		if(err)
			res.send(err);
		res.json(que);
	});
});


app.put('/editMapping',function(req,res){
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
		//console.log('else part');
		db.mapping.findAndModify({
		    query: { perfecticeId: map.perfecticeId },
		    update: { $set: { providerId: map.providerId } },
		    new: true
		}, function (err, doc, lastErrorObject) {
		    if(err)
				res.send(err);
			res.json(doc);
		});
	}
	
});

app.delete('/deleteMapping/:perfecticeId',function(req,res){
	var perfecticeId = req.params.perfecticeId;
	console.log(perfecticeId);
	if(!perfecticeId)
	{
		console.log('if part');
		res.json({"code": 500, "error": "Perfectice Id field is null.."})
	}
	else
	{
		perfecticeId  = mongojs.ObjectId(perfecticeId);
		//console.log('else part');
		db.mapping.remove({ perfecticeId: perfecticeId },
			function (err, doc) {
		    if(err)
				res.send(err);
			res.json(doc);
		});
	}
});
