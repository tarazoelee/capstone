import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea, useToast } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { baseURL } from "../config.js";

function ContactUs() {
  const nav = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: currentUser,
    message: "",
  });
  const toast = useToast();

  useEffect(() => {
    console.log(formData); // This will log formData every time it changes
  }, [formData]);

  function navDash() {
    nav("/dashboard");
  }

  function handleInputChange(event) {
    // Update formData state
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let result = await fetch(`${baseURL}/send-contact-email`, {
      method: "post",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.warn(result);
    if (result) {
      alert("Email was sent successfully");
    }
    setFormData({ email: currentUser, message: "" });
  }

  return (
    <div className="w-screen h-screen">
      <div className="self-start pl-16 gap-3 my-20 h-20 text-yellow-900 font-bold">
        <button onClick={navDash}>Dashboard</button>
      </div>
      <div className="flex h-full flex-col items-center">
        <div className="flex flex-col justify-center w-7/12 mb-44 gap-7 ">
          <div className="font-bold text-3xl text-yellow-900">Contact Us</div>
          <div className="flex flex-row font-bold text-lg text-yellow-900">
            We'd love to help. Reach out and we'll get in touch within 24 hours.{" "}
            <div className="ml-1 w-10 h-10">👐</div>
          </div>
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <Textarea
              name="message"
              placeholder="Leave us a message..."
              onChange={handleInputChange}
              value={formData.message}
              className="h-48 border-2 border-slate-200 rounded-md pl-4 pt-2 mb-4"
            />
            <button
              className="bg-gray-200 h-10 w-1/3 text-sm rounded-md hover:bg-gray-300 ease-linear transition duration-100"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
