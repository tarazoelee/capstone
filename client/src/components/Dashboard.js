import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Calendar } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import user from "../images/user.png";
import { baseURL } from "../config.js";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [podcastScript, setPodcastScript] = useState("");
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  // Format the date as "YYYY-MM-DD"
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

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

  //---------SCRAPING URLS -------
  // var nfl = 'https://newsapi.org/v2/top-headlines?' +
  // 'country=us&' +
  // 'category=sports&' +
  // 'q=NFL&' +
  // 'sortBy=popularity&' +
  // 'apiKey=94b9c0081ebf421b89233a87e38b17ef';

  var mlb =
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=baseball&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef";

  var nba =
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=NBA&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef";

  var ncaa =
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=ncaa&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef";

  var nhl =
    "https://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "category=sports&" +
    "q=nhl&" +
    "sortBy=popularity&" +
    "apiKey=94b9c0081ebf421b89233a87e38b17ef";

  async function scrapeNFL() {
    await fetch(`${baseURL}/scraper/nfl-articles`)
      .then((response) => response.json())
      .then((data) => {
        setPodcastScript(data.choices[0].message.content);
        console.log("podcast script", podcastScript);
      });
  }

  async function scrapeMLB() {
    await fetch(mlb)
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  async function scrapeNBA() {
    await fetch(nba)
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  async function scrapeNCAA() {
    await fetch(ncaa)
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  async function scrapeNHL() {
    await fetch(nhl)
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  return (
    <div className="font-display">
      <div className="flex h-full flex-col">
        <div className="bg-orange-950 py-20 px-80 shadow-lg flex-col">
            <div
                className="font-bold justify-self-end self-end flex-col gap-3 h-20 text-sm text-orange-200 mb-8"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="decoration-none hover:no-underline cursor-pointer text-base">
                  {currentUser.email}
                </div>
                <div>
                  {isDropdownVisible && (
                    <div>
                      <div
                        onClick={navProfile}
                        className="hover:text-orange-100  ease-linear transition duration-100 hover:cursor-pointer mt-1"
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
          </div>
          <div className="text-6xl font-bold text-left text-orange-200 w-3/5 pb-6">Listen to the news like never before.</div>
        </div>
        <div className="flex flex-col justify-center w-7/12 mb-44 mt-24 gap-7 self-center">
          <div onClick={scrapeNFL}>Scrape NFL</div>
          {podcastScript !== "" && <div>Podcast Script: {podcastScript}</div>}
          <div onClick={scrapeMLB}>Scrape MLB *** not working </div>
          <div onClick={scrapeNBA}>Scrape NBA</div>
          <div onClick={scrapeNCAA}>Scrape NCAA</div>
          <div onClick={scrapeNHL}>Scrape NHL</div>
          <div className="font-bold text-3xl text-orange-400">Today's Byte</div>
          <div className="px-28 py-20 bg-orange-200 text-gray-900 rounded-md shadow-lg">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like
            <br />
            <br />
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like
            <br />
            <br />
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like
          </div>
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
