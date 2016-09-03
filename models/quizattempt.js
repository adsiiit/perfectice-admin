var mongoose = require('mongoose');

//Quiz Attempt Schema
var quizattemptSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	questionId: { type: mongoose.Schema.Types.ObjectId },
	quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'QNewGame'},
	answerId: { type: mongoose.Schema.Types.ObjectId },
	timeTaken: Number,
	missed: Number,
	grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade'},
	//correct: Boolean,
	plusMark: Number,
	minusMark: Number,
	score: Number},
	{ timestamps: true }
);

var Quizattempt = module.exports = mongoose.model('Quizattempt', quizattemptSchema);

//Add Quiz Attempt
module.exports.addQuizattempt = function(quizattempt, callback){
	Quizattempt.create(quizattempt, callback);
};