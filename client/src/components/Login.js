import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleButton } from "react-google-button";
import { baseURL } from "../config.js";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser, googleSignIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let result = await fetch(`${baseURL}/register`, {
      method: "post",
      body: JSON.stringify({ name, email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.warn(result);
    if (result) {
      alert("Data saved succesfully");
      setEmail("");
      setName("");
    }
  };

  const nav = useNavigate();

  useEffect(() => {
    if (currentUser != null) {
      var userID = currentUser.uid;
      nav("dashboard");
    } else {
      nav("/");
    }
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (e) {
      setError("Failed to Login");
    }

    setLoading(false);
  }

  async function handleGoogleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      await googleSignIn();
    } catch (error) {
      setError("Failed to Login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/3 items-center justify-center rounded-r-md bg-[#ffdd80]">
        <div className="font-bold text-5xl px-32 text-yellow-900">
          {" "}
          Discover the daily news like never before.
        </div>
      </div>
      <div className="flex flex-col w-2/3 gap-6 justify-center items-center">
        <div className="font-bold text-3xl text-yellow-900">
          Welcome to DailyBytes
        </div>
        <div>
          {" "}
          <GoogleButton onClick={handleGoogleSignIn} />
        </div>
        <div> {error}</div>
        <div className="flex flex-col">
          <input
            className="mb-6 bg-none border-b border-black w-80 placeholder:text-black py-4"
            type="text"
            placeholder="Email"
            name="username"
            ref={emailRef}
            required
          />
          <input
            className="mb-6 border-b border-black placeholder:text-black py-4"
            type="password"
            placeholder="Password"
            name="password"
            ref={passwordRef}
            required
          />{" "}
          <button
            className="bg-gray-200 h-10 text-sm rounded-md hover:bg-gray-300 ease-linear transition duration-100"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Login
          </button>
          <div className="text-center mt-2 text-xs">
            Don't have an account?{" "}
            <a href="/signup" className="underline underline-offset-2">
              Sign Up
            </a>
          </div>
        </div>
      </div>
      {
        <form action="">
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" onClick={handleOnSubmit}>
            submit
          </button>
        </form>
      }
    </div>
  );
}
