import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const baseURL = process.env.REACT_APP_BASEURL;
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser, googleSignIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // const handleOnSubmit = async (e) => {
  //   e.preventDefault();
  //   let result = await fetch(`${baseURL}/register`, {
  //     method: "post",
  //     body: JSON.stringify({ name, email }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   result = await result.json();
  //   console.warn(result);
  //   if (result) {
  //     //alert("Data saved succesfully");
  //     setEmail("");
  //     setName("");
  //   }
  // };

  const nav = useNavigate();

  useEffect(() => {
    if (currentUser != null) {
      var userID = currentUser.uid;
      nav("dashboard");
    } else {
      nav("/");
    }
  }, [currentUser]);

  
  //submit on enter 
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  async function handleSubmit(e) {
    if(e){
    e.preventDefault();
  }
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
    } catch (e) {
      setError("Failed to Login");
    }

    setLoading(false);
  }
  

  return (
    <div className="flex h-full font-display">
      <div className="flex flex-col w-1/2 items-center justify-center rounded-xl p-10 my-5 mx-3 bg-orange-900 shadow-lg">
        <div className="font-bold text-6xl px-36 text-orange-300 leading-tight">
          {" "}
          Discover the daily news like never before.
        </div>
      </div>
      <div className="flex flex-col w-2/3 gap-6 justify-center items-center">
        <div className="text-3xl text-orange-900 py-4">
          Welcome to DailyBytes
        </div>

        <div> {error}</div>
        <div className="flex flex-col">
          <input
            className="mb-6 bg-none border border-gray-200 rounded-2xl w-80 px-4 placeholder:text-gray-600 py-4"
            type="text"
            placeholder="Email"
            name="username"
            ref={emailRef}
            onKeyDown={handleKeyPress}
            required
          />
          <input
            className="mb-6 border border-gray-200 rounded-2xl w-80 px-4 placeholder:text-gray-600 py-4"
            type="password"
            placeholder="Password"
            name="password"
            ref={passwordRef}
            onKeyDown={handleKeyPress}
            required
          />{" "}
          <button
            className="bg-gray-200 h-12 my-4 text-sm rounded-2xl hover:bg-gray-300 ease-linear transition duration-100 shadow-sm"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Login
          </button>
          <div className="text-center mt-3 text-xs text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="underline underline-offset-2">
              Sign Up
            </a>
          </div>
          <div className="text-center mt-3 text-xs text-gray-600">
            Forgot Password?{" "}
            <a href="/forgotpassword" className="underline underline-offset-2">
              Click Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
