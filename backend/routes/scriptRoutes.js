const express = require("express");
const app = express();
const axios = require("axios");

const scriptsModel = require("../models/Scripts")

// app.post("/addScript", async(req,res)=>{
//    try{ 
//     const script = req.body.script;
//     const users = req.body.users; //this needs to be an array
//     const date = Date();

//     const newScript = {
//       $set: {
//         script: script,
//         date: date,
//         users: users,
//       },
//     };
    
//     // Attempt to update the user
//     const posting = await scriptsModel.insertOne(newScript);
//     await posting.save();

//     } catch(e){
//         res.status(400).send("could not post")
//     }

// })

//get scripts from today 
app.get("/", async(req,res)=>{
    console.log('here')
try {
    const scripts = await scriptsModel.find();
    res.send(scripts);
  } catch (e) {
    res.send("unable to find")
    console.log("unable to get topics");
  }
})

//create audio file of text
app.post("/synthesize", async (req,res)=>{
    const text = req.body.text;
    const apikey = "AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA"
    const endpoint =`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apikey}`
    const payload = 
        {
            "audioConfig": {
                "audioEncoding": "MP3",
                "effectsProfileId": [
                "small-bluetooth-speaker-class-device"
                ],
                "pitch": 0,
                "speakingRate": 1
            },
            "input": {
                "text": text
            },
            "voice": {
                "languageCode": "en-US",
                "name": "en-US-Standard-A"
            }
            }
        const response = await axios.post(endpoint, payload)
        res.json(response.data); //going to contain the base64 audio content to be consumed by frontend 
})

module.exports = app;