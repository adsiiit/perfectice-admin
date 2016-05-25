var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//to create json document
app.use(bodyParser.json());



Subject = require('./models/subject');
Grade = require('./models/grade');
Topic = require('./models/topic');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/ProdDb');
var db = mongoose.connection;


//ROUTES -- START

var routes = require('./routes/index');
app.use('/', routes);

//ROUTES --END

app.listen(3000);
console.log('Running on  port 3000...');