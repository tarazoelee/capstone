const express = require("express");
const app = express();
const axios = require("axios");
const FormData = require("form-data");
const scriptsModel = require("../models/PodcastScripts");
const fs = require("fs");
const path = require("path");

const todaysDate = new Date().toISOString().split("T")[0];

// standardMaleUS: {
//     audioConfig: {
//       audioEncoding: "MP3",
//       effectsProfileId: ["small-bluetooth-speaker-class-device"],
//       pitch: 0,
//       speakingRate: 1,
//     },
//     input: {
//       text: "Script goes here", //Assuming script will be updated when synthesize is called 
//     },
//     voice: {
//       languageCode: "en-US",
//       name: "en-US-Wavenet-J",
//     },
//   },

const voiceTypes = {
  standardMaleUS: {
    voice: {
      languageCode: "en-US",
      name: "en-US-Wavenet-J",
    }
  },
  standardFemaleUS: {
    voice: {
      languageCode: "en-US",
      name: "en-US-Wavenet-F",
    }
  },
  standardMaleAUS: {
    voice: {
      "languageCode": "en-AU",
      "name": "en-AU-Wavenet-B"
    }
  },
  standardFemaleAUS: {
    voice: {
      "languageCode": "en-AU",
      "name": "en-AU-Wavenet-C"
    }
  },
  standardMaleGB: {
    voice: {
      "languageCode": "en-GB",
      "name": "en-GB-Wavenet-B"
    }
  },
  standardFemaleGB: {
    voice: {
      "languageCode": "en-GB",
      "name": "en-GB-Wavenet-A"
    }
  },
  }
//------GETTING ALL SCRIPTS--------
app.get("/", async (req, res) => {
  try {
    const scripts = await scriptsModel.find();
    res.send(scripts);
  } catch (e) {
    res.status(500).send("Unable to find scripts");
    console.error("Error occurred while retrieving scripts:", e);
  }
});

//------GETTING TODAY'S SCRIPTS AND CREATING PODCASTS--------
app.get("/todaysPodcasts", async (req, res) => {
  try {
    const scripts = await scriptsModel.find({
      date: todaysDate,
    });
    // Iterate over each script and convert it to audio, then update the document with the gridFsFileId
    for (const script of scripts) {
      try {
        const standardVoice = voiceTypes.standardFemaleAUS;
        const reference = await synthesize(script, standardVoice);

        // Directly find one script and update it with the new gridFsFileId
        const updatedScript = await scriptsModel.findOneAndUpdate(
          { _id: script._id },
          { $set: { refID: reference } },
          { new: true } // This option returns the modified document rather than the original
        );

        if (updatedScript) {
          console.log(`Updated script ${script._id} with refID ${reference}`);
        } else {
          console.log(`Script ${script._id} not found for update.`);
        }
      } catch (error) {
        console.error(`Error processing script ${script._id}:`, error);
      }
    }

    res.send({ message: "All scripts have been processed and updated" });     // After all scripts have been processed, send a response
  } catch (e) {
    res.status(500).send("Unable to process scripts");
    console.error("Error occurred while retrieving and processing scripts:", e);
  }
});


/**----GETTING TODAYS SCRIPT FOR A SPECIFIC USER ------ */
app.get("/todaysScript/:user", async (req, res) => {
  try {
    const userEmail = req.params.user; //getting email

    // Find scripts that match today's date and include the specific user in the users array
    const scripts = await scriptsModel.find({
      date: todaysDate,
      users: userEmail, // This will match any documents where the users array contains the userEmail
    });

    res.send(scripts);
  } catch (e) {
    res.status(500).send("Unable to find scripts");
    console.error("Error occurred while retrieving scripts:", e);
  }
});


/** ------Create audio file of text for a single script------ */ 
async function synthesize(script, voiceOption) {
  const apikey = "AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA";
  const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apikey}`;
  const uploadEndpoint = "http://localhost:5001/upload";

  const payload = 
  {
    audioConfig: {
      audioEncoding: "MP3",
      effectsProfileId: ["small-bluetooth-speaker-class-device"],
      pitch: 0,
      speakingRate: 1,
    },
    input: {
      text: script.script, //Assuming script will be updated when synthesize is called 
    },
    voice: {
      // languageCode: "en-US",
      // name: "en-US-Wavenet-J",
      ...voiceOption.voice
    },
  }

  try {
    // Post request to synthesize text
    const response = await axios.post(endpoint, payload);
    const audioContent = response.data.audioContent;
    const audioBuffer = Buffer.from(audioContent, "base64");

    // Create form data for file upload
    const formData = new FormData();
    formData.append("file", audioBuffer, "audio.mp3"); // 'audio.mp3' is the filename

    // Post request to upload the audio file
    const uploadResponse = await axios.post(uploadEndpoint, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    }); 

    //console.log(uploadResponse.data.fileId);
    const refID = uploadResponse.data.fileId; // Assuming the response structure includes {data: { fileId: "someId" }}
        console.log("Synthesized successfully")
    return refID;
  } catch (error) {
    console.error("Error occurred while synthesizing audio:", error);
    throw error; // Re-throw the error to be handled in the calling function
  }
}

module.exports = app;
