var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname+'/client'));
//to create json document
app.use(bodyParser.json());



Subject = require('./models/subject');
Grade = require('./models/grade');
Topic = require('./models/topic');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/ProdDb');


//ROUTES -- START
var routes = require('./routes/index');
//ROUTES --END

//ROUTES FOR MONGODB QUERIES  -- START
var queries = require('./routes/queries');
// ROUTES FOR MONGODB QUERIES --END

app.use('/', routes,queries);



app.listen(3030);
console.log('Running on  port 3030...');