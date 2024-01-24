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

  //NAVIGATION FUNCTIONS
  async function goBack() {
    nav("/signup");
  }

  async function Home() {
    nav("/");
  }

  /**GETTING TOPICS ON FIRST LOAD */
  useEffect(() => {
    getTopics();
  }, []);

  /**GETTING ALL TOPICS FROM THE TOPICS COLLECTION */
  async function getTopics() {
    await fetch(`${baseURL}/topics/`)
      .then((response) => response.json())
      .then((data) => {
        setTopics(data);
      });
  }

  //---TOPIC 1 IS SELECTED-----
  async function selectTopic(topic) {
    //UNSELECT SAME TOPIC
    if (topic1.length > 0 && topic1 == topic || topic2.length > 0 && topic2 == topic || topic3.length > 0 && topic3 == topic ) {
      unselectSameTopic(topic)
    }
    //SELECT NEW TOPIC AND UNSELECT OLD TOPIC
    else if (topic1.length > 0) {
      console.log("unselected: " + topic1);
      const oldtopicDiv = document.getElementById(`${topic1}` + "1");
      oldtopicDiv.style.backgroundColor = "rgb(254 215 170)";

      showTopic1Select(topic);
    }
    //SELECT A NEW TOPIC
    else {
      showTopic1Select(topic);
    }
  }

  //---- SELECT NEW TOPIC 1 AND CHANGE COLOR TO DISPLAY SELECTION----
  async function showTopic1Select(topic) {
    console.log("selected: " + topic);
    setTopic1(topic);
    const newtopicDiv = document.getElementById(`${topic}` + "1");
    newtopicDiv.style.backgroundColor = "rgb(251 146 60)";
  }

  async function unselectSameTopic(topic){
    if (topic1.length > 0 && topic1 == topic) {
      setTopic1("");
      const oldtopicDiv = document.getElementById(`${topic1}` + "1");
      oldtopicDiv.style.backgroundColor = "rgb(254 215 170)";
    }
    else if (topic2.length > 0 && topic2 == topic) {
      setTopic2("");
      const oldtopicDiv = document.getElementById(`${topic1}` + "1");
      oldtopicDiv.style.backgroundColor = "rgb(254 215 170)";
    }
    else if (topic3.length > 0 && topic3 == topic) {
      setTopic3("");
      const oldtopicDiv = document.getElementById(`${topic1}` + "1");
      oldtopicDiv.style.backgroundColor = "rgb(254 215 170)";
    }
    console.log("unselected: " + topic);
  }

  //-----SELECT LENGTH -----
  async function selectLength(l) {
    if (length.length > 0 && length == l) {
      const oldtopicDiv = document.getElementById(`${length}`);
      oldtopicDiv.style.backgroundColor = "rgb(254 215 170)";
      setLength("");
    } else if (length.length > 0) {
      const oldtopicDiv = document.getElementById(`${length}`);
      oldtopicDiv.style.backgroundColor = "rgb(254 215 170)";

      setLength(l);
      const lengthDiv = document.getElementById(l);
      lengthDiv.style.backgroundColor = "rgb(251 146 60)";
    } else {
      setLength(l);
      const lengthDiv = document.getElementById(l);
      lengthDiv.style.backgroundColor = "rgb(251 146 60)";
    }
  }

  //WHEN DONE IS CLICKED CHECK PREFS THEN SUBMIT THEM
  async function submitPrefs() {
    console.log(topic1);
    console.log(topic2);
    console.log(topic3);
    console.log(length);
    if (topic1 == topic2 || topic1 == topic3 || topic2 == topic3) {
      alert("Please select at least 2 unique topics");
    } else if (length.length <= 0) {
      alert("Please select a podcast length");
    } else {
      postPrefs();
    }
  }

  async function postPrefs() {
    console.log("posting" + topic1 + topic2 + topic3);
    await fetch(`${baseURL}/pref/postPrefs`, {
      method: "post",
      body: JSON.stringify({
        topic1: topic1,
        topic2: topic2,
        topic3: topic3,
        email: currentUser.email,
        length: length,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(Home());
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-full gap-12 py-24 font-display">
      <button
        className="flex justify-start self-start pl-40 pt-9 cursor-pointer font-bold text-orange-900 hover:text-orange-950 ease-linear transition duration-100"
        onClick={goBack}
      >
        Back
      </button>

      <div className="flex flex-col gap-2 items-center w-1/2 py-14">
        <div className="font-bold text-orange-900 text-xl">
          What Topics Interest You?
        </div>
        <div className="flex gap-10 flex-wrap items-center justify-center text-gray-700">
          {topics.map((t) => (
            <div
              id={t.topic}
              className="bg-orange-200 w-32 px-6 py-2 text-center rounded-med rounded cursor-pointer"
              onClick={() => selectTopic(t.topic)}
            >
              {t.topic}
            </div>
          ))}
        </div>

      </div>
      <div className="flex flex-col gap-2 items-center w-1/2">
        <div className="font-bold text-xl my-10 text-orange-900">
          How long do you want your daily updates?
        </div>
        <div className="flex gap-10 flex-wrap items-center justify-center text-gray-700">
          <div
            className="bg-orange-200 w-32 px-6 py-2 text-center rounded-med rounded"
            id="2 min"
            onClick={() => selectLength("2 min")}
          >
            {" "}
            1-2 min
          </div>
          <div
            className="bg-orange-200 w-32 px-6 py-2 text-center rounded-med rounded"
            id="5 min"
            onClick={() => selectLength("5 min")}
          >
            {" "}
            2-5 min{" "}
          </div>
          <div
            className="bg-orange-200 w-32 px-6 py-2 text-center rounded-med rounded"
            id="10 min"
            onClick={() => selectLength("10 min")}
          >
            5-10 min
          </div>
          <div
            className="bg-orange-200 w-32 px-6 py-2 text-center rounded-med rounded"
            id="20 min"
            onClick={() => selectLength("20 min")}
          >
            10-20 min
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={submitPrefs}
          className="mt-10 px-10 py-3 rounded-md bg-orange-900 text-white hover:bg-orange-950 ease-linear transition duration-100"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default CreateProfile;
