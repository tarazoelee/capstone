// To connect with your mongoDB database
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://azhitkev:dltImV1IGgFvxXje@capstone.8mdcviu.mongodb.net/", {
	dbName: 'capstoneDB',
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log('Connected Successfully'))

.catch((err) => { console.error(err); });;


// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
const topicsModel = require("./models/topics")
const usersModel = require("./models/Users")
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

	resp.send("App is Working");
	// You can check backend is working or not by 
	// entering http://loacalhost:5000
	
	// If you see App is working means backend working properly
});

//GETTING ALL TOPICS 
app.get("/topics",async(req,res)=>{
	try{
		const topics = await topicsModel.find({})
		res.send(topics)
	}
	catch(e){
		console.log("unable to get topics")
	}
})

//Adding User to Mongo
// ...

// app.post("/addUser", async (request, response) => {
//   try {
//     const user = new User(request.body);
// 	console.log("user"+ user)
// 	let result = await user.save();
// 	result = result.toObject();
// 	console.log(result)
//   } catch (error) {
//     response.status(500).send(error);
// 	console.log("Unable to add user")
//   }
// });

// ...


app.listen(5000);

//ADDING NEW USER ON SIGN UP 
app.post("/addUser", async (req, resp) => {
	const email = req.body.email
	//var checkEmail = usersModel.findOne({}, { email:email} )
	//console.log(checkEmail)

	var user = new usersModel({
		email: email,
		topic_1:"",
		topic_2:"",
		topic_3:""
	})
	//if( checkEmail.length <=0 ){
	user.save().then(()=>{
		console.log("New user created" + email)
	}).catch((err)=>{
		console.log("Unable to create new user"+ "\n" + err);
	})
	//}
	// else{
	// 	console.log("User already exists")
	// 	}
	})

app.post("/selectTopics", async (req, resp) => {
	try {

		topic = req.body;
		console.log(topic);

	} catch (e) {
		resp.send("Something Went Wrong");
	}
});

