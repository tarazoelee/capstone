import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { baseURL } from "../config.js";

function CreateProfile() {
  const nav = useNavigate();
  const [topics, setTopics] = useState([]);
  const { currentUser, logout } = useAuth();
  const [topic1, setTopic1] = useState([]);
  const [topic2, setTopic2] = useState([]);
  const [topic3, setTopic3] = useState([]);
  const [length, setLength] = useState([]);

  /**GETTING TOPICS ON FIRST LOAD */
  useEffect(() => {
    getTopics();
  }, []);

  /**GETTING ALL TOPICS FROM THE TOPICS COLLECTION */
  async function getTopics() {
    await fetch(`${baseURL}/topics`)
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
      });
  }

//WHEN EACH TOPIC IS CLICKED, SET TOPIC OBJECT TO SELECTED ITEM AND CHANGE ITS COLOUR
  async function selectTopic1(topic) {
    if(topic1.length >0){
      const oldtopicDiv = document.getElementById(`${topic1}` + "1");
      oldtopicDiv.style.backgroundColor = "rgb(255 237 213)";
    }

    setTopic1(topic)
    const newtopicDiv = document.getElementById(`${topic}` + "1");
    newtopicDiv.style.backgroundColor = "orange";
  }

  async function selectTopic2(topic) {
    if(topic2.length>0){
      const oldtopicDiv = document.getElementById(`${topic2}` + "2");
      oldtopicDiv.style.backgroundColor = "rgb(255 237 213)";
    }

    setTopic2(topic)
    const topicDiv = document.getElementById(`${topic}` + "2");
    topicDiv.style.backgroundColor = "orange";
  }

  async function selectTopic3(topic) {
    if(topic3.length >0){
      const oldtopicDiv = document.getElementById(`${topic3}` + "3");
      oldtopicDiv.style.backgroundColor = "rgb(255 237 213)";
    }
    setTopic3(topic)
    const topicDiv = document.getElementById(`${topic}` + "3");
    topicDiv.style.backgroundColor = "orange";
  }

  //CHANGING LENGTH COLOUR 
  async function selectLength(l) {
    if(length.length>0){
      const oldtopicDiv = document.getElementById(`${length}`);
      oldtopicDiv.style.backgroundColor = "rgb(255 237 213)";
    }

    setLength(l)
    const lengthDiv = document.getElementById(l);
    lengthDiv.style.backgroundColor = "orange";

  }

  //WHEN DONE IS CLICKED CHECK PREFS THEN SUBMIT THEM 
  async function submitPrefs(){
    console.log(topic1)
    console.log(topic2)
    console.log(topic3)
    console.log(length)
    if(topic1 == topic2 || topic1 == topic3 || topic2 == topic3){
      alert("Each topic must be unique")
    }
    else if(length.length <= 0){
      alert("Please select a podcast length")
    }
    postPrefs()
  }

  async function postPrefs(){
    console.log("posting" + topic1 + topic2 + topic3 )
      await fetch(`${baseURL}/postPrefs`, {
      method: "post",
      body: JSON.stringify({ topic1: topic1, topic2: topic2, topic3: topic3, email: currentUser.email, length: length}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    //   await fetch(`${baseURL}/selectTopic2`, {
    //   method: "post",
    //   body: JSON.stringify({ topic2: topic2, email: currentUser.email}),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
  }

  async function Home() {
    nav("/");
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-full gap-12">
      {/* {currentUser} */}
      <div className="flex flex-col gap-2 items-center w-1/2">
        <div className="font-bold text-black">What Topics Interest You?</div>

        <div className="italic text-black mt-10">Topic 1</div>
        <div className="flex gap-10 flex-wrap items-center justify-center">
          {topics.map((t) => (
            <div
              id={t.topic + "1"}
              className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
              onClick={() => selectTopic1(t.topic)}
            >
              {t.topic}
            </div>
          ))}
        </div>

        <div className="italic text-black mt-10">Topic 2</div>
        <div className="flex gap-10 flex-wrap items-center justify-center">
          {topics.map((t) => (
            <div
              id={t.topic + "2"}
              className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
               onClick={() => selectTopic2(t.topic)}
            >
              {t.topic}
            </div>
          ))}
        </div>

        <div className="italic text-black mt-10">Topic 3</div>
        <div className="flex gap-10 flex-wrap items-center justify-center">
          {topics.map((t) => (
            <div
              id={t.topic + "3"}
              className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
               onClick={() => selectTopic3(t.topic)}
            >
              {t.topic}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center w-1/2">
        <div className="font-bold text-black">
          How long do you want your daily updates?
        </div>
        <div className="flex gap-10 flex-wrap items-center justify-center">
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
            id="2 min"
            onClick={() => selectLength("2 min")}
          >
            {" "}
            1-2 min
          </div>
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
            id="5 min"
            onClick={() => selectLength("5 min")}
          >
            {" "}
            2-5 min{" "}
          </div>
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
            id="10 min"
            onClick={() => selectLength("10 min")}
          >
            5-10 min
          </div>
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded"
            id="20 min"
            onClick={() => selectLength("20 min")}
          >
            10-20 min
          </div>
        </div>
      </div>
      <div>
        <button onClick={submitPrefs}>Done</button>
      </div>
    </div>
  );
}

export default CreateProfile;
