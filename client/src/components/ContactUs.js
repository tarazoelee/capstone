import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea, useToast } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { baseURL } from "../config.js";
import Footer from "./Footer.js";
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";

function ContactUs() {
  const nav = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: currentUser,
    message: "",
  });
  const toast = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState('');
    /** -----MODAL STYLING------ */
    const modalStyle = {
      position: "absolute",
      top: "10%",
      borderRadius: '10px',
      left: "50%",
      textAlign:'center',
      transform: "translate(-50%, -50%)",
      width: 300,
      bgcolor: "background.paper",
      boxShadow: 10,
      p:4,
      fontFamily:'display',
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalText('');
  };


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
      setOpenModal(true);
      setModalText("Email was sent successfully.")
    }
    setFormData({ email: currentUser, message: "" });
  }

  return (
    <div className="w-screen h-screen font-display flex-col flex">
      <Modal 
        open={openModal} 
        onClose={handleCloseModal} 
        aria-describedby="modal-modal-title">
          <Box sx={modalStyle}>
            <p>{modalText}</p> 
          </Box>
        </Modal>
      <div className=" gap-3 my-20 h-20 px-72 place-self-end text-yellow-900 font-bold hover:text-yellow-700 ease-linear transition duration-100">
        <button onClick={navDash}>Dashboard</button>
      </div>
      <div className="flex h-full flex-col items-center">
        <div className="flex flex-col justify-center w-7/12 gap-7 ">
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
      <Footer></Footer>
    </div>
  );
}

export default ContactUs;
