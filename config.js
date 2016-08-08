var config = {};

//secret key to authenticate user to access Admin Panel
config.secret = 'SECRET';

//configuration for integration with NIIT
config.niit = {};
config.niit.secret = 'myperfectice_niit';

//mongo database
config.mongo = {};
config.mongo.uri = 'mongodb://localhost/ProdDb';
config.mongo.db = 'ProdDb';

//Port to run the server
config.port = 3030;

module.exports = config;