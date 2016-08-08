var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var Admin = mongoose.model('Admin');
var jwt = require('express-jwt');

//acts as middleware
var config = require('../config');
var auth = jwt({secret: config.secret, userProperty: 'payload'});


module.exports = app;

//to create json document
app.use(bodyParser.json());


//FOR AUTHENTICATION PURPOSE
app.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new Admin();

  user.username = req.body.username;

  user.setPassword(req.body.password);
  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


app.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});




/*app.get('/', function(req,res){
	res.send('Please use /grades , /subjects or /topics');
});*/

app.get('/subjects',auth, function(req,res){
	Subject.getSubjects(function(err, subjects){
		if(err){
			throw err;
		}
		res.json(subjects);
	});
});

app.get('/subjects/:_id',auth, function(req,res){
	Subject.getSubjectById(req.params._id, function(err, subject){
		if(err){
			throw err;
		}
		res.json(subject);
	});
});


app.get('/subjects/slugfly/:slug',auth, function(req,res){
	Subject.getSubjectBySlug(req.params.slug, function(err, subject){
		if(err){
			res.json({"code": 500, "error": "some error has been occured.."});
		}
		res.json(subject);
	});
});

app.post('/subjects',auth, function(req,res){
	var subject = req.body;
	Subject.addSubject(subject, function(err, subject){
		if(err){
			res.json({"code": 500, "error": "Subject Name already exists.."});
		}
		res.json(subject);
	});
});

app.put('/subjects/:_id',auth, function(req,res){
	var id = req.params._id;
	var subject = req.body;
	Subject.updateSubject(id, subject, {new: true}, function(err, subject){
		if(err){
			res.json({"code": 500, "error": "Subject Name already exists.."});
		}
		res.json(subject);
	});
});


app.delete('/subjects/:_id',auth, function(req,res){
	var id = req.params._id;
	Subject.removeSubject(id, function(err, subject){
		if(err){
			throw err;
		}
		res.json(subject);
	});
});

app.get('/grades',auth, function(req,res){
	Grade.getGrades(function(err, grades){
		if(err){
			throw err;
		}
		res.json(grades);
	});
});

app.get('/grades/:_id',auth, function(req,res){
	Grade.getGradeById(req.params._id, function(err, grade){
		if(err){
			throw err;
		}
		res.json(grade);
	});
});

app.get('/grades/slugfly/:slug',auth, function(req,res){
	Grade.getGradeBySlug(req.params.slug, function(err, grade){
		if(err){
			res.json({"code": 500, "error": "some error has been occured.."});
		}
		res.json(grade);
	});
});


app.post('/grades',auth, function(req,res){
	var grade = req.body;
	
	Grade.addGrade(grade, function(err, grade){
		if(err){
			res.json({"code": 500, "error": "Exam Name already exists.."});
			//console.log(err);
		}
		//console.log(grade);
		res.json(grade);
	});
});

app.put('/grades/:_id',auth, function(req,res){
	var id = req.params._id;
	var grade = req.body;
	Grade.updateGrade(id, grade, {new: true}, function(err, grade){
		if(err){
			res.json({"code": 500, "error": "Exam Name already exists.."});
		}
		res.json(grade);
	});
});

app.delete('/grades/:_id',auth, function(req,res){
	var id = req.params._id;
	Grade.removeGrade(id, function(err, grade){
		if(err){
			throw err;
		}
		res.json(grade);
	});
});

app.get('/topics',auth, function(req,res){
	Topic.getTopics(function(err, topics){
		if(err){
			throw err;
		}
		res.json(topics);
	});
});

app.get('/topics/:_id',auth, function(req,res){
	Topic.getTopicById(req.params._id, function(err, topic){
		if(err){
			throw err;
		}
		res.json(topic);
	});
});

app.get('/topics/slugfly/:slug',auth, function(req,res){
	Topic.getTopicBySlug(req.params.slug, function(err, topic){
		if(err){
			res.json({"code": 500, "error": "some error has been occured.."});
		}
		res.json(topic);
	});
});

app.post('/topics',auth, function(req,res){
	var topic = req.body;
	Topic.addTopic(topic, function(err, topic){
		if(err){
			res.json({"code": 500, "error": "Topic Name already exists.."});
		}
		res.json(topic);
	});
});

app.put('/topics/:_id',auth, function(req,res){
	var id = req.params._id;
	var topic = req.body;
	Topic.updateTopic(id, topic, {new: true}, function(err, topic){
		if(err){
			res.json({"code": 500, "error": "Topic Name already exists.."});
		}
		res.json(topic);
	});
});


app.delete('/topics/:_id',auth, function(req,res){
	var id = req.params._id;
	Topic.removeTopic(id, function(err, topic){
		if(err){
			throw err;
		}
		res.json(topic);
	});
});
