import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config.js";
import Footer from "./Footer.js";
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";


function Profile() {
  const nav = useNavigate();
  const [topics, setTopics] = useState([]);
  const [userTopics, setUserTopics] = useState([]);
  const [selectedLength, setSelectedLength] = useState("");
  const { currentUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState('');


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

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalText('');
  };

  /**GETTING TOPICS ON FIRST LOAD */
  useEffect(() => {
    getTopics();
    getUserLengthandPrefs();
  }, []);

  /**GETTING ALL TOPICS FROM THE TOPICS COLLECTION */
  async function getTopics() {
    await fetch(`${baseURL}/topics/`)
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
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

      setSelectedLength(topics.length); // Assuming the length is determined by the number of topics
      setUserTopics(topics);
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
    try {
      if (userTopics.length === 3) {
        await fetch(`${baseURL}/pref/updatePreferences`, {
          method: "POST",
          body: JSON.stringify({
            email: currentUser.email,
            topic1: userTopics[0],
            topic2: userTopics[1],
            topic3: userTopics[2],
            length: selectedLength,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        alert("Select 3 Topics");
      }
      alert("User Preferences Updated Successfully");
    } catch (e) {
      alert("Unable to Update User Preferences");
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-display text-yellow-900 ">
      <Modal 
        open={openModal} 
        onClose={handleCloseModal} 
        aria-describedby="modal-modal-title">
          <Box sx={modalStyle}>
            <p>{modalText}</p> 
          </Box>
        </Modal>
      <div className="font-bold flex justify-end px-72 pt-24 hover:text-yellow-700 ease-linear transition duration-100">
        <button onClick={navDash}>Dashboard</button>
      </div>
      <div className="flex flex-col gap-12 justify-center items-center my-20 py-12 px-72 ">
        <div className="flex gap-10 text-yellow-900 font-bold ">
          <div className="font-bold text-base">User since November 2023</div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="font-bold text-base">Account Email</div>
          <div className="bg-gray-100 rounded-md px-28 py-2 text-xs">
            {currentUser.email}
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <div className="font-bold text-base"> Podcast Email</div>
          <div className="bg-gray-100 rounded-md px-28 py-2 text-xs">
            podcast@email.com
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center flex-wrap mt-14 px-28">
          <div className="font-bold text-base">Your Interests</div>
          <div className="flex gap-10 flex-wrap justify-center items-center">
            {topics.map((topicObj, index) => {
              const topicName = topicObj.topic;

              const topicClass = isUserTopic(topicName)
                ? "bg-orange-300 cursor-pointer" // Darker shade for user's topic
                : "bg-orange-100 cursor-pointer"; // Lighter shade for other topics

              return (
                <div
                  key={index}
                  className={`${topicClass} w-32 px-6 py-2 align-middle text-center text-xs rounded-med rounded hover:bg-orange-200 ease-linear transition duration-100`}
                  onClick={() => handleTopicClick(topicName)}
                >
                  {topicName}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-10 justify-center items-center flex-col mt-14">
          <div className="font-bold text-base">Podcast Length</div>
          <div className="flex gap-10 flex-wrap justify-center">
            {["2 min", "5 min", "10 min", "20 min"].map(
              (lengthValue, index) => (
                <div
                  key={index}
                  className={`${selectedLength === lengthValue
                      ? "bg-orange-300"
                      : "bg-orange-100"
                    } w-32 px-6 py-2 text-center text-xs rounded-med rounded cursor-pointer hover:bg-orange-200 ease-linear transition duration-100`}
                  onClick={() => handleLengthClick(lengthValue)}
                >
                  {lengthValue}
                </div>
              )
            )}
          </div>
        </div>

        <div className="">
          <button
            onClick={saveChanges}
            className="bg-orange-900 text-gray-100 mt-10 px-10 py-2 rounded-md hover:bg-yellow-700 ease-linear transition duration-100"
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
