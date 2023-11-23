import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch (e) {
      setError("Failed to Signup");
    }

    setLoading(false);
  }
  return (

    <div className="flex h-full">
      <div className="flex flex-col w-1/3 items-center justify-center rounded-r-md bg-[#ffdd80]">
        <div className="font-bold text-5xl px-32 text-yellow-900"> Discover the daily news like never before.</div>
      </div>
      <div className="flex flex-col w-2/3 gap-6 justify-center items-center">
        <div className="font-bold text-3xl text-yellow-900">
          Create your account
        </div>
        <div>
          Continue with Google 
        </div>
        <div className="flex flex-col">
          <input
              className="mb-6 bg-none border-b border-black w-80 placeholder:text-black py-4"
              type="text"
              placeholder="Email"
              name="email"
              ref={emailRef}
              required
            />
            <input
              className="mb-6 bg-none border-b border-black w-80 placeholder:text-black py-4"
              type="text"
              placeholder="Username"
              name="username"
              ref={emailRef}
              required
            />
           <input
               className="mb-6 bg-none border-b border-black w-80 placeholder:text-black py-4"
              type="password"
              placeholder="Password"
              name="password"
              ref={passwordRef}
              required
            />{" "}
             <input
              className="mb-6 bg-none border-b border-black w-80 placeholder:text-black py-4"
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              ref={passwordRef}
              required
            />{" "}
            <button
              className="bg-gray-200 h-10 text-sm rounded-md hover:bg-gray-300 ease-linear transition duration-100"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              Sign Up
            </button>
        </div>
        
      </div>
    </div>

  );
}
