import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup, currentUser } = useAuth();
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
    <div className="flex flex-col mt-6">
      {JSON.stringify(currentUser.email)}
      <input
        className="mb-6"
        type="text"
        placeholder="Enter Username"
        name="username"
        ref={emailRef}
        required
      />
      <input
        className="mb-6"
        type="password"
        placeholder="Enter Password"
        name="password"
        ref={passwordRef}
        required
      />{" "}
      <button
        className="bg-red-500"
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        Signup
      </button>
    </div>
  );
}
