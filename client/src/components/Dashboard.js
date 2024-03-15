import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Calendar } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import user from "../images/user.png";
import { baseURL } from "../config.js";
import Typewriter from "typewriter-effect";
//import { response } from "../../../backend/routes/scraperRoutes.js";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [podcastScript, setPodcastScript] = useState("");
  const [podcastRefID, setPodcastRefID] = useState("");
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const audioRef = useRef(null); // Create a ref for the audio element

  /**GETTING SCRIPTS ON FIRST LOAD */
  useEffect(() => {
    getTodaysScript();
  }, []);

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

  async function getPodcast() {
    if (!podcastRefID) return; // Exit if there is no podcastRefID

    try {
      const response = await fetch(
        `http://localhost:5001/image/${podcastRefID}`
      );
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

  // Call getPodcast when the component mounts or podcastRefID changes
  useEffect(() => {
    getPodcast();
  }, [podcastRefID]);

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
            className="font-bold flex-col h-20 text-sm text-orange-200 mb-8 flex float-right w-20"
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
          <div className="px-28 py-20 bg-orange-50 text-gray-900 rounded-md shadow-lg">
            {podcastScript}
          </div>
        </div>
        <div className="audio-player-container">
          <audio controls ref={audioRef}>
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="flex flex-col justify-center w-7/12 mb-44 gap-7 self-center">
          <div className="font-bold text-3xl text-orange-900">Past Bytes</div>
          <div className="">{/* {<Calendar />} */}</div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
