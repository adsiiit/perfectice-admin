var mongoose = require('mongoose');

//subject Schema
var subjectSchema = mongoose.Schema({
	slugfly: {type:String, required:true, unique: true},
	name: {type:String, required:true},
	grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade'},
	countryCode: String,
	status: { type: Boolean, default: true },
	topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]},
	{ timestamps: true }

);

var Subject = module.exports = mongoose.model('Subject', subjectSchema);


//Get Subjects
module.exports.getSubjects = function(callback, limit){
	Subject.find(callback).limit(limit);
};

//Get Subject by Id
module.exports.getSubjectById = function(id, callback){
	Subject.findById(id, callback);
}

//Get Subject by Slugfly
module.exports.getSubjectBySlug = function(slug, callback){
	var query = {slugfly: slug};
	Subject.findOne(query, callback);
}


//Add Subject
module.exports.addSubject = function(subject, callback){
	Subject.create(subject, callback);
};

//Update Subject
module.exports.updateSubject = function(id, subject, options, callback){
	var query = {_id: id};
	var update = {
		slugfly: subject.slugfly,
		name: subject.name,
		grade: subject.grade,
		countryCode: subject.countryCode,
		status: subject.status,
		topics: subject.topics
	}
	Subject.findOneAndUpdate(query, update, options, callback);
};


//Delete Subject
module.exports.removeSubject = function(id, callback){
	var query = {_id: id};
	Subject.remove(query, callback);
};