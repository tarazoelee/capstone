import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Calendar } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import user from "../images/user.png";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

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

  function navContactUs() {
    nav("/contact-us");
  }

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <div className="font-display py-10">
      <div className="flex pl-24 gap-3 my-10 h-20">
        <div
          className="text-orange-900 font-bold"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-orange-900 decoration-none hover:no-underline cursor-pointer text-base">
            {currentUser.email}
          </div>
          <div>
            {isDropdownVisible && (
              <div>
                <div
                  onClick={navProfile}
                  className="hover:text-orange-700 text-orange-900 ease-linear transition duration-100 hover:cursor-pointer mt-1"
                >
                  Profile
                </div>
                <div>
                  <button
                    onClick={navContactUs}
                    className="hover:text-gray-100 text-yellow-900 ease-linear transition duration-100 mt-1"
                  >
                    Contact Us
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="hover:text-orange-700 text-orange-900 ease-linear transition duration-100 mt-1"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-full flex-col px-56">
        <div className="justify-start border-gray-800 text-orange-200 font-bold text-6xl text-left bg-orange-950 py-36 px-20 shadow-lg rounded-lg">
          <div className="w-3/5">Listen to the news like never before.</div>
        </div>
        <div className="flex flex-col justify-center w-7/12 mb-44 mt-24 gap-7 self-center">
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
    </div>
  );
}
