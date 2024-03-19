import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await forgotPassword(emailRef.current.value);
      nav("/");
    } catch {
      setError("Failed to Send Email");
    }

    setLoading(false);
  }

  async function goBack(){
    nav("/")
  }

  return (
    <div className="py-40 px-60 font-display">
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