import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config.js";

function Profile() {
  const nav = useNavigate();
  const [topics, setTopics] = useState([]);

  const [userTopics, setUserTopics] = useState([]);
  const [selectedLength, setSelectedLength] = useState("");
  const { currentUser } = useAuth();

  /**GETTING TOPICS ON FIRST LOAD */
  useEffect(() => {
    getTopics();

    getUserTopics();

  }, []);

  /**GETTING ALL TOPICS FROM THE TOPICS COLLECTION */
  async function getTopics() {
    await fetch(`${baseURL}/topics`)
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
      });
  }

  /**GETTING USERS SELECTED TOPICS*/
  async function getUserTopics() {
    await fetch(
      `${baseURL}/getUserTopics?email=${encodeURIComponent(currentUser.email)}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserTopics(data);
      });
  }

  /**GETTING USERS SELECTED LENGTH*/
  async function getUserLength() {
    await fetch(
      `${baseURL}/getUserLength?email=${encodeURIComponent(currentUser.email)}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserTopics(data);
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
    // Set the selected length to the clicked value
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
          // Display an error message and don't add the new topic
          alert(
            "You can only select up to 3 topics. Please deselect one before adding another."
          );
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
        await fetch(`${baseURL}/updatePreferences`, {
          method: "POST",
          body: JSON.stringify({
            topic1: userTopics[0],
            topic2: userTopics[1],
            topic3: userTopics[2],
            email: currentUser.email,
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

  function saveChanges() {}

  return (
    <div className="flex flex-col min-h-screen font-display">
      <div className="self-start pl-16 gap-3 my-20 h-20 text-yellow-900 font-bold">
        <button onClick={navDash}>Dashboard</button>
      </div>
      <div className="text-black flex flex-col gap-12 justify-center items-center">
        <div className="flex gap-10 text-yellow-900 font-bold">
          <div className="font-bold">User since November 2023</div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="font-bold text-gray-600">Account Email</div>
          <div className="bg-gray-100 rounded-md px-28 py-2 text-xs">
            {currentUser.email}
          </div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="font-bold text-gray-600"> Podcast Email</div>
          <div className="bg-gray-100 rounded-md px-28 py-2 text-xs">
            podcast@email.com
          </div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="font-bold text-gray-600">Your Interests</div>
          <div className="flex gap-10">
            {topics.map((topicObj, index) => {
              const topicName = topicObj.topic;

              const topicClass = isUserTopic(topicName)
                ? "bg-orange-300 cursor-pointer" // Darker shade for user's topic
                : "bg-orange-100 cursor-pointer"; // Lighter shade for other topics

              return (
                <div
                  key={index}
                  className={`${topicClass} w-32 px-6 py-2 text-center rounded-med rounded`}
                  onClick={() => handleTopicClick(topicName)}
                >
                  {topicName}
                </div>
              );
            })}
          </div>
        </div>


        <div className="flex gap-10 flex-wrap items-center justify-center">
          {["1-2 min", "2-5 min", "5-10 min", "10-20 min"].map(
            (lengthValue, index) => (
              <div
                key={index}
                className={`${
                  selectedLength === lengthValue
                    ? "bg-orange-300"
                    : "bg-orange-100"
                } w-32 px-6 py-2 text-center rounded-med rounded cursor-pointer`}
                onClick={() => handleLengthClick(lengthValue)}
              >
                {lengthValue}
              </div>
            )
          )}
        </div>

        <div className="">
          <button
            onClick={saveChanges}
            className="bg-orange-900 text-gray-100 mt-10 px-10 py-2 rounded-md"
          >

            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
