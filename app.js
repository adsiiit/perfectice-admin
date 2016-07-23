var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var morgan      = require('morgan');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

app.use(express.static(__dirname+'/client'));
app.use(passport.initialize());

//to create json document
app.use(bodyParser.json());



Subject = require('./models/subject');
Grade = require('./models/grade');
Topic = require('./models/topic');
User = require('./models/user');
Admin = require('./models/admin')


require('./config/passport');
var config = require('./config');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/ProdDb');
app.set('SecretKey', config.secret);
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


//ROUTES FOR INTEGRATION WITH NIIT  -- START
var mpniit = require('./routes/perfecticeNiit');
var mpniit_api = mpniit.app;
var mpniit_apiR = mpniit.apiRoutes;
// ROUTES FOR INTEGRATION WITH NIIT  --END

app.use('/', routes,queries, mpniit_api, mpniit_apiR);

app.listen(3030);
console.log('Running on  port 3030...');