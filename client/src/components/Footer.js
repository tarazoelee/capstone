import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Footer(){
    const [error, setError] = useState("");
    const nav = useNavigate();
    const { currentUser, logout } = useAuth();

    function navContactPage() {
        nav("/contact-us");
    }

    function navProfile() {
        nav("/profile");
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

 return(
     <div className='bg-orange-50 py-24 px-56 text-black flex'>
        <div class="flex gap-4 justify-self-start content-center">
            <div onClick={navContactPage}>Contact Us</div>
            <div onClick={navProfile}>Profile</div>
            <div onClick={handleLogout}>Logout</div>
        </div>
        <div class="justify-self-end">
                Made in London 
        </div>
     </div>
 );
}
