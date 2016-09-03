var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var morgan      = require('morgan');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var path = require('path');

app.use(express.static(__dirname+'/client'));
app.use(passport.initialize());

//to create json document
app.use(bodyParser.json());



Subject = require('./models/subject');
Grade = require('./models/grade');
Topic = require('./models/topic');
User = require('./models/user');
Admin = require('./models/admin')
Quizattempt = require('./models/quizattempt')
QContactList = require('./models/qContactList')
QFriendList = require('./models/qFriendList')
QInvitation = require('./models/qInvitation')
QNewGame = require('./models/qNewGame')
NewAttempt = require('./models/newattempt')


require('./config/passport');
var config = require('./config');

//Connect to Mongoose
mongoose.connect(config.mongo.uri);
app.set('SecretKey', config.niit.secret);
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));

// use morgan to log requests to the console
app.use(morgan('dev'));


//ROUTES -- START
var routes = require('./routes/index');
//ROUTES --END

//ROUTES FOR MONGODB QUERIES  -- START
var queries = require('./routes/queries');
// ROUTES FOR MONGODB QUERIES --END

//ROUTES FOR INTEGRATION  -- START
var integration = require('./routes/integration');
// ROUTES FOR INTEGRATION --END

//ROUTES FOR QUIZ  -- START
var quiz = require('./routes/quiz');
// ROUTES FOR QUIZ --END


//ROUTES FOR INTEGRATION WITH NIIT  -- START
var mpniit = require('./routes/perfecticeNiit');
var mpniit_api = mpniit.app;
var mpniit_apiR = mpniit.apiRoutes;
// ROUTES FOR INTEGRATION WITH NIIT  --END

//ROUTES FOR ATTEMPT REDESIGN  -- START
var newattempt = require('./routes/newAttempt');
// ROUTES FOR ATTEMPT REDESIGN --END

app.use('/api', routes, queries, mpniit_api, mpniit_apiR);
app.use('/api2', integration,quiz);
/*app.use('/api3', newattempt);*/

/*app.use('*',function(req,res,next){
	var indexFile = path.resolve(__dirname,'client/index.html');
	res.sendFile(indexFile);
})
*/

app.listen(config.port);
console.log('Running on  port '+config.port+' ...');