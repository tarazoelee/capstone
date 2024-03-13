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
    const response = fetch(`${baseURL}/users/addUser`, {
      method: "post",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      // Await the addUser response
      const addUserResponse = await addUser(emailRef.current.value);

      if (addUserResponse.status === 400) {
        throw new Error("Failed to Signup");
      }

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
      <div className="flex flex-col w-1/2 items-center justify-center rounded-xl p-10 my-5 mx-3 bg-orange-200 shadow-lg">
        <div className="font-bold text-6xl px-36 text-orange-900 leading-tight">
          {" "}
          Discover the daily news like never before.
        </div>
      </div>
      <div className="flex flex-col w-2/3 gap-6 justify-center items-center">
        <div className="text-3xl text-orange-900">Create your account</div>
        <div> {error}</div>
        <div className="flex flex-col">
          <input
            className="mb-6 bg-none border border-gray-200 rounded-2xl w-80 px-4 placeholder:text-gray-600 py-4"
            type="text"
            placeholder="Email"
            name="email"
            ref={emailRef}
            required
          />
          <input
            className="mb-6 bg-none border border-gray-200 rounded-2xl w-80 px-4 placeholder:text-gray-600 py-4"
            type="password"
            placeholder="Password"
            name="password"
            ref={passwordRef}
            required
          />{" "}
          <input
            className="mb-6 bg-none border border-gray-200 rounded-2xl w-80 px-4 placeholder:text-gray-600 py-4"
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            ref={confirmPasswordRef}
            required
          />{" "}
          <button
            className="bg-gray-200 h-12 my-4 text-sm rounded-2xl hover:bg-gray-300 ease-linear transition duration-100 shadow-sm"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Sign Up
          </button>
          <button
            className="text-center mt-2 text-xs hover:text-gray-800 ease-linear transition duration-100 underline"
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
