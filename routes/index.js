var express = require('express');
var app = express();
var bodyParser = require('body-parser');

module.exports = app;

//to create json document
app.use(bodyParser.json());




app.get('/', function(req,res){
	res.send('Please use /api/grades , /api/subjects or /api/topics');
});

app.get('/api/subjects', function(req,res){
	Subject.getSubjects(function(err, subjects){
		if(err){
			throw err;
		}
		res.json(subjects);
	});
});

app.get('/api/subjects/:_id', function(req,res){
	Subject.getSubjectById(req.params._id, function(err, subject){
		if(err){
			throw err;
		}
		res.json(subject);
	});
});

app.post('/api/subjects', function(req,res){
	var subject = req.body;
	Subject.addSubject(subject, function(err, subject){
		if(err){
			throw err;
		}
		res.json(subject);
	});
});

app.put('/api/subjects/:_id', function(req,res){
	var id = req.params._id;
	var subject = req.body;
	Subject.updateSubject(id, subject, {new: true}, function(err, subject){
		if(err){
			throw err;
		}
		res.json(subject);
	});
});


app.delete('/api/subjects/:_id', function(req,res){
	var id = req.params._id;
	Subject.removeSubject(id, function(err, subject){
		if(err){
			throw err;
		}
		res.json(subject);
	});
});

app.get('/api/grades', function(req,res){
	Grade.getGrades(function(err, grades){
		if(err){
			throw err;
		}
		res.json(grades);
	});
});

app.get('/api/grades/:_id', function(req,res){
	Grade.getGradeById(req.params._id, function(err, grade){
		if(err){
			throw err;
		}
		res.json(grade);
	});
});

app.post('/api/grades', function(req,res){
	var grade = req.body;
	
	Grade.addGrade(grade, function(err, grade){
		if(err){
			throw err;
		}
		res.json(grade);
	});
});

app.put('/api/grades/:_id', function(req,res){
	var id = req.params._id;
	var grade = req.body;
	Grade.updateGrade(id, grade, {new: true}, function(err, grade){
		if(err){
			throw err;
		}
		res.json(grade);
	});
});

app.delete('/api/grades/:_id', function(req,res){
	var id = req.params._id;
	Grade.removeGrade(id, function(err, grade){
		if(err){
			throw err;
		}
		res.json(grade);
	});
});

app.get('/api/topics', function(req,res){
	Topic.getTopics(function(err, topics){
		if(err){
			throw err;
		}
		res.json(topics);
	});
});

app.get('/api/topics/:_id', function(req,res){
	Topic.getTopicById(req.params._id, function(err, topic){
		if(err){
			throw err;
		}
		res.json(topic);
	});
});

app.post('/api/topics', function(req,res){
	var topic = req.body;
	Topic.addTopic(topic, function(err, topic){
		if(err){
			throw err;
		}
		res.json(topic);
	});
});

app.put('/api/topics/:_id', function(req,res){
	var id = req.params._id;
	var topic = req.body;
	Topic.updateTopic(id, topic, {new: true}, function(err, topic){
		if(err){
			throw err;
		}
		res.json(topic);
	});
});


app.delete('/api/topics/:_id', function(req,res){
	var id = req.params._id;
	Topic.removeTopic(id, function(err, topic){
		if(err){
			throw err;
		}
		res.json(topic);
	});
});
