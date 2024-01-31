const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	email:{
		type:String,
		required:true
	},
    topic_1:{
		type:String,
		required:false
	},
    topic_2:{
		type:String,
		required:false
	},
    topic_3:{
		type:String,
		required:false
	},
	topic_4:{
		type:String,
		required:false
	},
	topic_5:{
		type:String,
		required:false
	},
	length:{
		type:String,
		required:false
	}
})

const Users = mongoose.model('users', UserSchema)
Users.createIndexes();

module.exports = Users;