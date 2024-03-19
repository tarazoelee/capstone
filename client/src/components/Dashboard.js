import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "rsuite/dist/rsuite.min.css";
import Typewriter from "typewriter-effect";
import Calendar from "react-calendar";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import './styles.css'; 
//import { response } from "../../../backend/routes/scraperRoutes.js";

export default function Dashboard() {
  const baseURL = process.env.REACT_APP_BASEURL;
  const [date, setDate] = useState(new Date());
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [error, setError] = useState("");
  const [podcastScript, setPodcastScript] = useState("");
  const { currentUser, logout } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const nav = useNavigate();
  const audioRef = useRef(null); // Create a ref for the audio element
  const refIDDateDictionary = {};
  const audioData = {};

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    py: 6,
    px: 10,
  };

  function formatDateToYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**GETTING SCRIPTS ON FIRST LOAD */
  useEffect(() => {
    getTodaysScript();
    getAllOldScript();
  }, [audioData]);

 async function openPreviewModal(date) {
  const formattedDate = formatDateToYYYYMMDD(date);

  // Fetch the old script information first, then update the state and open the modal.
  try {
    const data = await getOldScript(formattedDate);
    if (data && data.length > 0) {
      const script = data[0].script;
      const oldRefID = data[0].refID;
      const audioURL = audioData[oldRefID];
      console.log(audioData)

    setModalContent(
        <div>
          <div className="font-bold text-black text-xl">{formattedDate}</div>
          <div className="my-4">{script}</div>
          {!audioURL && <p>Loading audio...</p>}
          {audioURL &&
            <audio
              controls 
              src={audioURL}
            >
              Your browser does not support the audio element.
            </audio>
          }
        </div>
      )
      // Load the audio and then open the modal
      setOpenModal(true);

    } else {
      setModalContent(// Handle the case where no script is found for the selected date
        <div>
          <h2>Podcast Preview for {formattedDate}</h2>
          <p>No byte for this day.</p>
        </div>
      );
      setOpenModal(true);
    }
  } catch (error) {
    console.error("Error fetching old script:", error);
  }
}

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent("");
  };

  async function getTodaysScript() {
    await fetch(`${baseURL}/scripts/todaysScript/${currentUser.email}`)
      .then((res) => res.json())
      .then((data) => {
        const userScript = data.filter(
          (item) => item.users[0] === currentUser.email
        );
        if (userScript.length > 0) {
          setPodcastScript(userScript[0].script);
          getPodcast(userScript[0].refID); //getting today's podcast
        } else {
          setPodcastScript("No byte today... :(");
        }
      });
  }

  //----GETTING OLD SCRIPTS -------
  async function getOldScript(d) {
    try {
      const response = await fetch(
        `${baseURL}/scripts/pastScript/${currentUser.email}/${d}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json(); // Return the data directly
    } catch (error) {
      console.error("Error fetching old script:", error);
      throw error; // Re-throw the error to be caught in the calling function
    }
  }

//----GETTING All OLD SCRIPTS -------
  async function getAllOldScript() {
    try {
      const response = await fetch(`${baseURL}/scripts/pastScript/${currentUser.email}`);
      const data = await response.json();
        // Iterate over the data array and extract refID and date
      data.forEach((item) => {
        const refID = item.refID;
        const date = item.date;
        refIDDateDictionary[date] = refID;
        getPodcast(refID); //generating audio of each refID 
      });

    } catch (error) {
      console.error("Error fetching old scripts", error);
      throw error; // Re-throw the error to be caught in the calling function
    }
  }


  async function getPodcast(refID) {
    if (!refID) return; // Exit if there is no podcastRefID
    try {
      const response = await fetch(`${baseURL}/image/${refID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
      if(url && !audioData[refID]){
        audioData[refID] = url; //adding audio to map in audioData dictionary 
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  async function handleLogout() {
    setError("");
    try {
      await logout();
      nav("/");
    } catch {
      setError("Failed to log out");
    }
  }

  function navProfile() {
    nav("/profile");
  }

  function navContactPage() {
    nav("/contact-us");
  }

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="font-display">
      <div className="flex h-full flex-col">
        <div className="bg-orange-950 py-24 px-72 shadow-lg flex-col">
          <div
            className="font-semibold flex-col h-20 text-sm text-orange-200 mb-8 flex float-right w-20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="decoration-none hover:no-underline cursor-pointer text-base mb-0">
              {currentUser.email}
            </div>
            {isDropdownVisible && (
              <div>
                <div
                  onClick={navProfile}
                  className="hover:text-orange-100 ease-linear transition duration-100 hover:cursor-pointer mt-1"
                >
                  Profile
                </div>
                <div>
                  <button
                    onClick={navContactPage}
                    className="hover:text-orange-100 ease-linear transition duration-100 mt-1"
                  >
                    Contact Us
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="hover:text-orange-100 ease-linear transition duration-100 mt-1"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <div className="text-6xl font-bold text-left text-orange-200 w-3/5 h-40 pt-10">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(" Listen to the news like never before.")
                  .callFunction(() => {
                  })
                  .start();
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center w-7/12 mb-44 mt-24 gap-7 self-center">
          <div className="font-bold text-3xl text-orange-900">Today's Byte</div>
          <div className="px-28 py-14 bg-orange-50 text-gray-900 rounded-md shadow-lg flex flex-col gap-6 align-middle">
            <div className="flex flex-col justify-center align-middle items-center">
              <audio controls ref={audioRef} className="w-1/2">
                Your browser does not support the audio element.
              </audio>
            </div>
            <div className="leading-7 text-base">{podcastScript} </div>
          </div>
        </div>

        <div className="flex flex-col justify-center w-7/12 mb-44 gap-7 self-center">
          <div className="font-bold text-3xl text-orange-900">Past Bytes</div>
          <div className="cal-container ">

            <Calendar
              value={new Date(date)}
              onClickDay={(value) => {
                const newDate = new Date(value).setHours(0, 0, 0, 0);
                const todayDate = new Date().setHours(0, 0, 0, 0);
                setDate(new Date(newDate).toISOString());
                openPreviewModal(value);
              }}
            />

          </div>
        </div>
        {/* Modal component */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={modalStyle}>
            <div id="modal-description">{modalContent}</div>
          </Box>
        </Modal>
      </div>
      <Footer></Footer>
    </div>
  );
}
