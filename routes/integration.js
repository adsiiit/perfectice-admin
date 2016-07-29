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


app.get('/api2/getVideosList/:prov/:id', function(req,res){
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