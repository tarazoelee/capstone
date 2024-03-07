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

 return(
     <div className='bg-orange-50 py-24 px-56 text-black flex'>
        <div onClick={navContactPage}>Contact Us</div>
        <div onClick={navContactPage}>Profile</div>
     </div>
 );
}
