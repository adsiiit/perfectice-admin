var mongoose = require('mongoose');

//grade Schema
var gradeSchema = mongoose.Schema({
	slugfly: {type:String, required:true, unique: true},
	name: {type:String, required:true},
	countryCode: String,
	status: { type: Boolean, default: true },
	subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]},
	{ timestamps: true }

);

var Grade = module.exports = mongoose.model('Grade', gradeSchema);


//Get Grades
module.exports.getGrades = function(callback, limit){
	Grade.find(callback).limit(limit);
};

//Get Grade by Id
module.exports.getGradeById = function(id, callback){
	Grade.findById(id, callback);
}

//Get Grade by Slugfly
module.exports.getGradeBySlug = function(slug, callback){
	var query = {slugfly: slug};
	Grade.findOne(query, callback);
}

//Add Grade
module.exports.addGrade = function(grade, callback){
	Grade.create(grade, callback);
};

//Update Grade
module.exports.updateGrade = function(id, grade, options, callback){
	var query = {_id: id};
	var update = {
		slugfly: grade.slugfly,
		name: grade.name,
		countryCode: grade.countryCode,
		subjects: grade.subjects,
		status: grade.status
	}
	Grade.findOneAndUpdate(query, update, options, callback);
};

//Delete Grade
module.exports.removeGrade = function(id, callback){
	var query = {_id: id};
	Grade.remove(query, callback);
};