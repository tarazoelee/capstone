const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
	topic:{
		type:String,
		required:true
	}
})

const Topics = mongoose.model('topics', TopicSchema)

module.exports = Topics;