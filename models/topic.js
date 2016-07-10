var mongoose = require('mongoose');

//topic Schema
var topicSchema = mongoose.Schema({
	slugfly: {type:String, required:true},
	name: {type:String, required:true},
	status: { type: Boolean, default: true },
	subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required:true}},
	{ timestamps: true }
);

var Topic = module.exports = mongoose.model('Topic', topicSchema);

//Get Topics
module.exports.getTopics = function(callback, limit){
	Topic.find(callback).limit(limit);
};

//Get Topic by Id
module.exports.getTopicById = function(id, callback){
	Topic.findById(id, callback);
}

//Add Topic
module.exports.addTopic = function(topic, callback){
	Topic.create(topic, callback);
};

//Update Topic
module.exports.updateTopic = function(id, topic, options, callback){
	var query = {_id: id};
	var update = {
		slugfly: topic.slugfly,
		name: topic.name,
		subject: topic.subject,
		status: topic.status
	}
	Topic.findOneAndUpdate(query, update, options, callback);
};

//Delete Topic
module.exports.removeTopic = function(id, callback){
	var query = {_id: id};
	Topic.remove(query, callback);
};