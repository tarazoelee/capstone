import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {Calendar} from "rsuite"
import 'rsuite/dist/rsuite.min.css';
import user from "../images/user.png"

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  async function handleLogout() {
    setError("");
    try {
      await logout().then(nav("/"));
    } catch {
      setError("Failed to log out");
    }
  }
  
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
   
  <div>
    
    <div className="flex items-center pl-16 gap-3 py-20">
        <div className="">
          {
            /**<img src={user} className="w-8"></img> */
          }
        </div>
        <div 
          className="text-yellow-900 font-bold self-startflex flex-col"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/profile" className="text-yellow-900 decoration-none hover:text-yellow-900 hover:no-underline">
            {currentUser.email}
          </a>
          <div>
             {isDropdownVisible && 
                <div>
                  <div className="hover:text-gray-100 text-yellow-900 ease-linear transition duration-100">Profile</div>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-gray-100 text-yellow-900 ease-linear transition duration-100"
                  >
                    Log Out
                  </button>
                </div>
                }
          </div>
        </div>
    </div>
    <div className="flex h-full flex-col items-center">
      
       <div className="flex flex-col justify-center w-7/12 mb-44 gap-7 ">
        <div className="font-bold text-3xl text-yellow-900">
          Today's Byte
        </div>
         <div className="px-20 py-10 bg-orange-100 text-black rounded-md">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like</div>
       </div>
   
       <div className="flex flex-col justify-center w-7/12 mb-44 gap-7">
        <div className="font-bold text-3xl text-yellow-900">
          Past Bytes
        </div>
        <div className="">
          <Calendar/>
        </div>
       </div>
    </div>
  </div> 
  );
}
