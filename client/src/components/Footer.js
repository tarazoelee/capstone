import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Footer(){
    const nav = useNavigate();

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
