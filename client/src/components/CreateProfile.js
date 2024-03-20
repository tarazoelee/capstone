import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

function CreateProfile() {
  const baseURL = process.env.REACT_APP_BASEURL;
  const nav = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const { currentUser, logout } = useAuth();
  const [length, setLength] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [voiceTypes, setVoiceTypes] = useState([]);

  const voiceTypeLabels = {
    standardMaleUS: "American Male",
    standardFemaleUS: "American Female",
    standardMaleAUS: "Australian Male",
    standardFemaleAUS: "Australian Female",
    standardMaleGB: "British Male",
    standardFemaleGB: "British Female",
  };

  const style = {
    position: "absolute",
    top: "10%",
    borderRadius: "10px",
    left: "50%",
    textAlign: "center",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    boxShadow: 10,
    p: 4,
    fontFamily: "display",
  };

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

  async function getVoiceTypes() {
    await fetch(`${baseURL}/pref/getVoiceTypes`)
      .then((res) => res.json())
      .then((data) => {
        setVoiceTypes(data);
        console.log(voiceTypes);
      });
  }

  const handleVoiceClick = (voice) => {
    console.log(voice);
    setSelectedVoice(voice);
  };

  //---TOPIC IS SELECTED-----
  async function selectTopic(topic) {
    //UNSELECT SAME TOPIC
    if (selectedTopics.includes(topic)) {
      setSelectedTopics((top) => top.filter((t) => t != topic));
      unshowTopicSelect(topic);
      console.log("unselected: " + topic);
    } else if (selectedTopics.length < 3) {
      setSelectedTopics((prevSelectedTopics) => [...prevSelectedTopics, topic]);
      showTopicSelect(topic);
      console.log("selected: " + topic);
    } else {
      setOpenModal(true);
      setModalText("Select a maximum of 3 topics.");
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalText("");
  };

  //---- SELECT NEW TOPIC AND CHANGE COLOR TO DISPLAY SELECTION----
  async function showTopicSelect(topic) {
    const newtopicDiv = document.getElementById(`${topic}`);
    newtopicDiv.style.backgroundColor = "rgb(180 83 9)";
    newtopicDiv.style.color = "white";
  }

  async function unshowTopicSelect(topic) {
    const newtopicDiv = document.getElementById(`${topic}`);
    newtopicDiv.style.backgroundColor = "rgb(255 237 213)";
    newtopicDiv.style.color = "rgb(124 45 18)";
  }

  //-----SELECT LENGTH -----
  async function selectLength(l) {
    //unselect length
    if (length.includes(l)) {
      setLength("");
      unshowTopicSelect(l);
    } else if (length.length < 1) {
      setLength(l);
      showTopicSelect(l);
    }
  }

  //WHEN DONE IS CLICKED CHECK PREFS THEN SUBMIT THEM
  async function submitPrefs() {
    if (selectedTopics.length <= 0) {
      setOpenModal(true);
      setModalText("Select at least one topic.");
    } else if (length.length <= 0) {
      setOpenModal(true);
      setModalText("Select a podcast length.");
    } else if (!selectedVoice) {
      setOpenModal(true);
      setModalText("Select a voice.");
    } else {
      postPrefs();
    }
  }

  async function postPrefs() {
    await fetch(`${baseURL}/pref/postPrefs`, {
      method: "post",
      body: JSON.stringify({
        topic1: selectedTopics[0],
        topic2: selectedTopics[1],
        topic3: selectedTopics[2],
        email: currentUser.email,
        length: length,
        voice: selectedVoice,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(Home());
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-full gap-8 py-24 font-display text-yellow-950 ">
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-describedby="modal-modal-title"
      >
        <Box sx={style}>
          <p>{modalText}</p>
        </Box>
      </Modal>

      <button
        className="flex justify-start self-start pl-40 pt-9 cursor-pointer font-bold text-orange-900 hover:text-orange-950 ease-linear transition duration-100"
        onClick={goBack}
      >
        Back
      </button>

      <div className="flex flex-col gap-2 items-center w-1/2 py-14">
        <div className=" text-orange-900 text-xl">
          What Topics Interest You?
        </div>
        <div className="italic">Select up to 3</div>
        <div className="flex gap-10 flex-wrap items-center justify-center mt-4 font-semibold">
          {topics.map((t) => (
            <div
              id={t.topic}
              className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded hover:bg-orange-200 cursor-pointer ease-linear transition duration-100"
              onClick={() => selectTopic(t.topic)}
            >
              {t.topic}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center w-1/2">
        <div className="text-xl my-10 text-orange-900">
          How long do you want your daily updates?
        </div>
        <div className="flex gap-10 flex-wrap items-center justify-center font-semibold ">
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded hover:bg-orange-200 cursor-pointer ease-linear transition duration-100"
            id="2 min"
            onClick={() => selectLength("2 min")}
          >
            {" "}
            2 min
          </div>
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded hover:bg-orange-200 cursor-pointer ease-linear transition duration-100"
            id="5 min"
            onClick={() => selectLength("5 min")}
          >
            {" "}
            5 min{" "}
          </div>
          <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded hover:bg-orange-200 cursor-pointer ease-linear transition duration-100"
            id="10 min"
            onClick={() => selectLength("10 min")}
          >
            10 min
          </div>
           {/* <div
            className="bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded hover:bg-orange-200 cursor-pointer ease-linear transition duration-100"
            id="20 min"
            onClick={() => selectLength("20 min")}
          >
            20 min
          </div> */}
        </div>
      </div>

      <div className="flex gap-10 justify-center items-center flex-col mt-14 w-1/2">
        <div className="text-xl text-orange-900">Voice Types</div>
        <div className="flex gap-10 flex-wrap justify-center font-semibold ">
          {voiceTypes.map((type, index) => (
            <div
              key={index}
              className={`${
                selectedVoice == type.voicetypes
                  ? "bg-amber-700 text-white hover:text-white hover:bg-amber-700"
                  : "bg-orange-100 hover:bg-orange-200"
              } w-40 px-6 py-4 text-center text-xs rounded-med rounded cursor-pointer ease-linear transition duration-100`}
              onClick={() => handleVoiceClick(type.voicetypes)}
            >
              {voiceTypeLabels[type.voicetypes] || type.voiceTypes}
            </div>
          ))}
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
