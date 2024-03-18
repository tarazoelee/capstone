import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "rsuite/dist/rsuite.min.css";
import { baseURL } from "../config.js";
import Typewriter from "typewriter-effect";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

//import { response } from "../../../backend/routes/scraperRoutes.js";

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [error, setError] = useState("");
  // const [newsContent, setNewsContent] = useState("");
  const [podcastScript, setPodcastScript] = useState("");
  const [podcastRefID, setPodcastRefID] = useState("");
  const { currentUser, logout } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  //const today = new Date();
  const nav = useNavigate();
  // const year = today.getFullYear();
  // const month = today.getMonth() + 1;
  // const day = today.getDate();
  const audioRef = useRef(null); // Create a ref for the audio element

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  function formatDateToYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function openPreviewModal() {
    const formattedDate = formatDateToYYYYMMDD(date);
    // Fetch the old script information first, then update the state and open the modal.
    try {
      const data = await getOldScript(formattedDate);
      if (data && data.length > 0) {
        // Directly use the fetched data to set modal content and open modal
        const script = data[0].script;
        const oldRefID = data[0].refID;
        setModalContent(
          <>
            <h2>Podcast Preview for {formattedDate}</h2>
            <p>{script}</p>
            Optional: If you decide to add the audio player
            {oldRefID && (
              <audio controls src={`${baseURL}/image/${oldRefID}`}>
                Your browser does not support the audio element.
              </audio>
            )}
          </>
        );
        setOpenModal(true);
      } else {
        // Handle the case where no script is found for the selected date
        setModalContent(
          <>
            <h2>Podcast Preview for {formattedDate}</h2>
            <p>No byte for this day.</p>
          </>
        );
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error fetching old script:", error);
      // Optionally handle the error, e.g., by showing an error message in the modal
    }
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent("");
  };

  /**GETTING SCRIPTS ON FIRST LOAD */
  useEffect(() => {
    getTodaysScript();
  }, []);

  // Call getPodcast when the component mounts or podcastRefID changes
  useEffect(() => {
    getPodcast();
  }, [podcastRefID]);

  async function getTodaysScript() {
    await fetch(`${baseURL}/scripts/todaysScript/${currentUser.email}`)
      .then((res) => res.json())
      .then((data) => {
        const userScript = data.filter(
          (item) => item.users[0] === currentUser.email
        );
        if (userScript.length > 0) {
          setPodcastScript(userScript[0].script);
          setPodcastRefID(userScript[0].refID);
        } else {
          setPodcastScript("No byte today... :(");
        }
      });
  }

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

  async function getPodcast() {
    if (!podcastRefID) return; // Exit if there is no podcastRefID

    try {
      const response = await fetch(`${baseURL}/image/${podcastRefID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
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
        <div className="bg-orange-950 py-24 px-72 shadow-lgflex-col">
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
                    console.log("String typed out!");
                  })
                  .start();
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center w-7/12 mb-44 mt-24 gap-7 self-center">
          <div className="font-bold text-3xl text-orange-900">Today's Byte</div>
          <div className="px-28 py-14 bg-orange-50 text-gray-900 rounded-md shadow-lg flex flex-col gap-6 align-middle">
            <div className="">
              <audio controls ref={audioRef}>
                Your browser does not support the audio element.
              </audio>
            </div>
            <div>{podcastScript} </div>
          </div>
        </div>

        <div className="flex flex-col justify-center w-7/12 mb-44 gap-7 self-center">
          <div className="font-bold text-3xl text-orange-900">Past Bytes</div>
        </div>
        <Calendar
          onChange={(value) => {
            const newDate = new Date(value).setHours(0, 0, 0, 0);
            const todayDate = new Date().setHours(0, 0, 0, 0);
            setDate(new Date(newDate).toISOString());
            setShowPreviewButton(newDate < todayDate);
          }}
          value={new Date(date)}
        />

        {showPreviewButton && (
          <button
            onClick={openPreviewModal}
            className="mt-4 px-6 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md"
          >
            Preview for {date.split("T")[0]}
          </button>
        )}
        {/* Modal component */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={modalStyle}>
            <p id="modal-description">{modalContent}</p>
          </Box>
        </Modal>
      </div>
      <Footer></Footer>
    </div>
  );
}
