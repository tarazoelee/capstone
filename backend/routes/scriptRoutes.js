const express = require("express");
const app = express();
const axios = require("axios");

const scripts = require("../models/PodcastScripts")

app.post("/addScript", async(req,res)=>{
    const script = req.body.script;
    const users = req.body.users;

    

})

//get scripts from today 
app.get("/", async(req,res)=>{

    try{


    }
    catch(e){
        res.status(400).send("Cannot get scripts");
    }
})

//create audio file of text
app.post("/synthesize", async (req,res)=>{
    const text = req.body.text;
    const apikey = "AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA"
    const endpoint =    `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA}`
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