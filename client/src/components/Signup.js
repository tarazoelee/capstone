import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config.js";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { currentUser, logout, signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function goBack() {
    nav("/");
  }

  //ADD USER TO MONGODB
  function addUser(email) {
    fetch(`${baseURL}/addUser`, {
      method: "post",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      //adding user to mongo
      console.log(emailRef.current.value);
      addUser(emailRef.current.value);

      await signup(emailRef.current.value, passwordRef.current.value).then(
        nav("/createProfile")
      );
    } catch (e) {
      setError("Failed to Signup");
    }
    setLoading(false);
  }
  return (
    <div className="flex h-full font-display">
      <div className="flex flex-col w-1/3 items-center justify-center rounded-r-md bg-orange-300">
        <div className="font-bold text-6xl px-28 text-orange-900 leading-tight">
          {" "}
          Discover the daily news like never before.
        </div>
      </div>
      <div className="flex flex-col w-2/3 gap-6 justify-center items-center">
        <div className="text-3xl text-orange-900">
          Create your account
        </div>
        <div>Continue with Google</div>
        <div> {error}</div>
        <div className="flex flex-col">
          <input
            className="mb-6 bg-none border-b border-gray-500 w-80 placeholder:text-gray-600  py-4"
            type="text"
            placeholder="Email"
            name="email"
            ref={emailRef}
            required
          />
          <input
            className="mb-6 bg-none border-b border-gray-500 w-80 placeholder:text-gray-600  py-4"
            type="password"
            placeholder="Password"
            name="password"
            ref={passwordRef}
            required
          />{" "}
          <input
            className="mb-6 bg-none border-b border-gray-500 w-80 placeholder:text-gray-600  py-4"
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            ref={confirmPasswordRef}
            required
          />{" "}
          <button
            className="bg-gray-200 h-10 text-sm rounded-md hover:bg-gray-300 ease-linear transition duration-100 my-5"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Sign Up
          </button>
          <button
            className="text-center mt-2 text-xs hover:text-gray-800 ease-linear transition duration-100"
            type="submit"
            onClick={goBack}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
