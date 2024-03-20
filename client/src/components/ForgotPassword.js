import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

export default function ForgotPassword() {
  const baseURL = process.env.REACT_APP_BASEURL;
  const { forgotPassword } = useAuth();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const response = await fetch(
        `${baseURL}/users/findUser/${emailRef.current.value}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setOpenModal(true);
          setModalText("Cannot Send Forgot Password Email");
        } else {
          setModalText("Cannot Send Forgot Password Email");
        }
      } else {
        await forgotPassword(emailRef.current.value);
        setOpenModal(true);
        setModalText("Check your inbox.");
      }
    } catch {
      setError("Failed to Send Email");
    }

    setLoading(false);
  }

  async function goBack() {
    nav("/");
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalText("");
    nav("/");
  };

  /** -----MODAL STYLING------ */
  const modalStyle = {
    position: "absolute",
    top: "10%",
    borderRadius: "10px",
    left: "50%",
    textAlign: "center",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    boxShadow: 10,
    p: 4,
    fontFamily: "display",
  };

  return (
    <div className="py-40 px-60 font-display">
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-describedby="modal-modal-title"
      >
        <Box sx={modalStyle}>
          <p>{modalText}</p>
        </Box>
      </Modal>
      {error && <p>{error}</p>}
      <div
        onClick={goBack}
        className="text-orange-900 justify-end cursor-pointer font-semibold hover:text-yellow-700 ease-linear transition duration-100"
      >
        Back
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center my-32 gap-3">
          <div className="font-bold text-xl">Forgot Password?</div>
          <div>No worries, we'll send you a link to reset it.</div>
          <div className="flex gap-3 justify-center align-middle items-center my-4">
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              ref={emailRef} // Associating the input with the emailRef
              required
              className="bg-none border border-gray-200 rounded-2xl w-80 px-4 placeholder:text-gray-600 py-4 text-s"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-12 bg-gray-200 h-12 my-4 text-sm rounded-2xl hover:bg-gray-300 ease-linear transition duration-100 shadow-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
