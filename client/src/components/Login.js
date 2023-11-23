import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value)
        .then(nav("/dashboard"));
    } catch (e) {
      setError("Failed to Signup");
    }

    setLoading(false);
  }
  return (
    <div className="flex mt-6 items-center">
      <div className="flex flex-col w-1/3 border-2">
        <div>Discover the daily news like never before</div>
      </div>
      <div className="flex flex-col w-2/3 border-2 justify-center items-center">
        <div className="font-bold text-3xl">
          Log In to DailyBytes
        </div>
        <div>
          Continue with Google 
        </div>
        <div className="flex flex-col gap-7">
          <input
            className="mb-6 bg-none border-b border-black w-80"
            type="text"
            placeholder="Email"
            name="username"
            ref={emailRef}
            required
          />
          <input
            className="mb-6 border-b border-black"
            type="password"
            placeholder="Password"
            name="password"
            ref={passwordRef}
            required
          />{" "}
          <button
            className="bg-gray-200 h-10 text-sm"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
