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
     <div className='bg-orange-50 pt-16 pb-12 px-32 text-black flex justify-between text-orange-950'>
        <div class="flex gap-4 content-center">
            <div class="hover:cursor-pointer" onClick={navContactPage}>Contact Us</div>
            <div class="hover:cursor-pointer" onClick={navProfile}>Profile</div>
            <div class="hover:cursor-pointer" onClick={handleLogout}>Logout</div>
        </div>
        <div class="">
                Made in London &#x1F9E1;
        </div>
     </div>
 );
}
