var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NewAttemptSchema = new Schema({
	//the teacher
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	studentName: {type: String},
	email: {type: String, lowercase: true},
	practicesetId: {type: Schema.Types.ObjectId, ref: 'PracticeSet', required: true},
	practiceSetInfo: {
		title: {type: String},
		titleLower: {type: String, lowercase: true},
		subject: [{
				_id: {type: Schema.Types.ObjectId, ref: 'Subject'},
				name: {type: String}
			}],
		grades: [{
				_id: {type: Schema.Types.ObjectId, ref: 'Grades'},
				name: {type: String}
			}],
		
		createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
		accessMode: {
			type: String,
			enum: ['public', 'invitation', 'buy'],
			default: 'public'
		},
		classRooms: [{ type: Schema.Types.ObjectId ,ref: 'ClassRoom'}]
	},

	createdBy: {
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		name: {type: String}
	},
	totalQuestions: {type: Number},
	totalMarkeds:{type: Number,default:0},
	isAbandoned: {type: Boolean, default: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	totalCorrects: {type: Number,default: 0},
	totalTime: {type: Number,default: 0},
	totalErrors: {type: Number,default: 0},
	totalMissed: {type: Number,default: 0},
	minusMark: {type: Number, default: 0},
	plusMark: {type: Number, default: 0},
	totalMark:{type: Number, default: 0},

	questionDetails: [{
			topic: {_id: {type: Schema.Types.ObjectId, ref: 'Topic'},
				name: String},
			subject: {
				_id: {type: Schema.Types.ObjectId, ref: 'Subject'},
				name: {type: String}
			},
			answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
			question: {type: Schema.Types.ObjectId, ref: 'Question'},
			isMissed: {type: Boolean, default: false},
			timeEslapse: {type: Number},
			answerChanged:{type: Number},

			status: {type: Number},
			hasMarked:{type: Boolean, default: false},
			plusMark: {type: Number, default: 0},
			minusMark: {type: Number, default: 0},
		}
	]},
	{ timestamps: true }
);
NewAttemptSchema.pre('save', function(next) {
	this.wasNew = this.isNew;

	if (!this.isNew) {
		this.updatedAt = new Date();
	} else {
		this.totalMark = this.minusMark + this.plusMark;
	}
	if (this.practiceSetInfo) {
		this.practiceSetInfo.titleLower = this.practiceSetInfo.title;
	}
	next();
});

module.exports = mongoose.model('NewAttempt', NewAttemptSchema);