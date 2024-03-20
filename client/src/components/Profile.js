import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer.js";
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";


function Profile() {
  const baseURL = process.env.REACT_APP_BASEURL;
  const nav = useNavigate();
  const [topics, setTopics] = useState([]);
  const [userTopics, setUserTopics] = useState([]);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const { currentUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [accountYear, setAccountYear] = useState('');
  const [accountMonth, setAccountMonth] = useState('');
  const [voiceTypes, setVoiceTypes] = useState([]);
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  /** -----MODAL STYLING------ */
  const modalStyle = {
    position: "absolute",
    top: "10%",
    borderRadius: '10px',
    left: "50%",
    textAlign:'center',
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    boxShadow: 10,
    p:4,
    fontFamily:'display',
};

  const voiceTypeLabels = {
    standardMaleUS: 'American Male',
    standardFemaleUS: 'American Female',
    standardMaleAUS: 'Australian Male',
    standardFemaleAUS: 'Australian Female',
    standardMaleGB: 'British Male',
    standardFemaleGB: 'British Female',
  };

function getMonthName(monthNumber) {
  // Subtracting 1 as month numbers are 1-indexed
  const index = monthNumber - 1;
  return monthNames[index];
}

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalText('');
  };

  /**GETTING TOPICS ON FIRST LOAD */
  useEffect(() => {
    getTopics();
    getUserLengthandPrefs();
    getUserCreationDate();
    getVoiceTypes();
  }, []);

  /**GETTING ALL TOPICS FROM THE TOPICS COLLECTION */
  async function getTopics() {
    await fetch(`${baseURL}/topics/`)
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
      });
  }

  async function getVoiceTypes(){
     await fetch(`${baseURL}/pref/getVoiceTypes`)
      .then((res) => res.json())
      .then((data) => {
        setVoiceTypes(data);
      });
  
  }

  /**GETTING USERS SELECTED LENGTH*/
  async function getUserLengthandPrefs() {
    await fetch(
      `${baseURL}/pref/getUserLengthAndPreferences?email=${encodeURIComponent(
        currentUser.email
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        const topics = [];

        // Loop through each property in the data object
        for (const key in data) {
          // Check if the property starts with 'topic' and is not a function
          if (key.startsWith('topic') && typeof data[key] !== 'function') {
            // Push the topic value into the topics array
            topics.push(data[key]);
          }
        }

      setSelectedLength(data.length); // Assuming the length is determined by the number of topics
      setUserTopics(topics);
      setSelectedVoice(data.voice);
      setSelectedSpeed(data.speed);
      console.log(data)
      });
  }

   /**GETTING USERS ACCOUNT CREATION DATE*/
  async function getUserCreationDate() {
    await fetch(
      `${baseURL}/pref/getUserCreationDate?email=${encodeURIComponent(
        currentUser.email
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAccountYear(data.year);
        setAccountMonth(getMonthName(data.month));
      });
  }


  function navDash() {
    nav("/dashboard");
  }

  // Function to check if a topic is one of the user's topics
  const isUserTopic = (topicName) => {
    return userTopics.includes(topicName);
  };

  const handleLengthClick = (lengthValue) => {
    setSelectedLength(lengthValue);
  };

  const handleVoiceClick = (voice) => {
    setSelectedVoice(voice);
  };

  const handleTopicClick = (topicName) => {
    setUserTopics((prevTopics) => {
      if (prevTopics.includes(topicName)) {
        // Remove the topic if it's already in the array
      return prevTopics.filter((topic) => topic !== topicName);
      } else {
          // Check if there are already 3 topics selected
          if (prevTopics.length >= 3) {
           setOpenModal(true);
           setModalText('Select a maximum of 3 topics.')
          return prevTopics;
        }
        // Add the topic if it's not in the array and there are less than 3 topics already selected
        return [...prevTopics, topicName];
      }
    });
  };

  async function saveChanges() {
    try{
    if (userTopics && userTopics.length <=0) {
        setOpenModal(true);
        setModalText('Select at least one topic.')
      } 
      else {
        await fetch(`${baseURL}/pref/updatePreferences`, {
          method: "POST",
          body: JSON.stringify({
            email: currentUser.email,
            topic1: userTopics[0],
            topic2: userTopics[1],
            topic3: userTopics[2],
            length: selectedLength,
            voice: selectedVoice,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setOpenModal(true);
      setModalText('User preferences updates.')
    }
      catch(e){
        setOpenModal(true);
        setModalText('Unable to update user preferences')
      }
    
  }

  return (
    <div className="flex flex-col min-h-screen font-display text-yellow-950">
      <Modal 
        open={openModal} 
        onClose={handleCloseModal} 
        aria-describedby="modal-modal-title">
          <Box sx={modalStyle}>
            <p>{modalText}</p> 
          </Box>
        </Modal>
      <div className="flex justify-end px-72 pt-24 font-semibold hover:text-yellow-700 ease-linear transition duration-100">
        <button onClick={navDash}>Dashboard</button>
      </div>
      <div className="flex flex-col gap-12 self-center items-center mt-20 mb-28 px-40">
        <div className="flex gap-10 ">
          <div className="text-lg">User since {accountMonth} {accountYear} </div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="text-base">Account Email</div>
          <div className="bg-gray-100 rounded-md px-28 py-2 text-xs">
            {currentUser.email}
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center flex-wrap mt-10 px-28">
          <div className="text-lg">Your Interests</div>
          <div className="flex gap-10 flex-wrap justify-center items-center font-semibold">
            {topics.map((topicObj, index) => {
              const topicName = topicObj.topic;

              const topicClass = isUserTopic(topicName)
                ? "bg-amber-700 text-white hover:text-white hover:bg-amber-700 " // Darker shade for user's topic
                : "bg-orange-100"; // Lighter shade for other topics

              return (
                <div
                  key={index}
                  className={`${topicClass} w-32 px-6 py-2 align-middle text-center cursor-pointer text-xs rounded-med rounded hover:bg-orange-200 hover:text-yellow-900 ease-linear transition duration-100`}
                  onClick={() => handleTopicClick(topicName)}
                >
                  {topicName}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center flex-col mt-14">
          <div className="text-lg">Podcast Length</div>
          <div className="flex gap-10 flex-wrap justify-center font-semibold">
            {["2 min", "5 min", "10 min"].map(
              (lengthValue, index) => (
                <div
                  key={index}
                  className={`${selectedLength === lengthValue
                      ? "bg-amber-700 text-white hover:text-white hover:bg-amber-700"
                      : "bg-orange-100"
                    } w-32 px-6 py-2 text-center text-xs rounded-med rounded cursor-pointer hover:bg-orange-200 hover:text-yellow-900 ease-linear transition duration-100`}
                  onClick={() => handleLengthClick(lengthValue)}
                >
                  {lengthValue}
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center flex-col mt-14">
          <div className="text-lg">Podcast Speed</div>
          <div className="flex gap-10 flex-wrap justify-center font-semibold">
            {["Slow", "Normal", "Fast"].map(
              (speedValue, index) => (
                <div
                  key={index}
                  className={`${selectedSpeed == speedValue
                      ? "bg-amber-700 text-white hover:text-white hover:bg-amber-700"
                      : "bg-orange-100"
                    } w-32 px-6 py-2 text-center text-xs rounded-med rounded cursor-pointer hover:bg-orange-200 hover:text-yellow-900 ease-linear transition duration-100`}
                  onClick={() => handleLengthClick(speedValue)}
                >
                  {speedValue}
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center flex-col mt-14">
          <div className="text-lg">Voice Types</div>
           <div className="flex gap-10 flex-wrap justify-center font-semibold">
            {voiceTypes.map((type, index)=>(
              <div 
                key={index}
                className={`${selectedVoice == type.voicetypes
                      ? "bg-amber-700 text-white hover:text-white hover:bg-amber-700 "
                      : "bg-orange-100"
                    } w-40 px-6 py-4 text-center text-xs rounded-med rounded cursor-pointer hover:bg-orange-200 hover:text-yellow-900 ease-linear transition duration-100`}
                onClick={() => handleVoiceClick(type.voicetypes)}
              >
                {voiceTypeLabels[type.voicetypes] || type.voiceTypes}
              </div>
            ))

            }
          </div>
        </div>

        <div className="">
          <button
            onClick={saveChanges}
            className="bg-orange-900 text-gray-100 mt-10 px-10 py-2 rounded-md hover:bg-amber-700 ease-linear transition duration-100 font-bold"
          >
            Save
          </button>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Profile;
