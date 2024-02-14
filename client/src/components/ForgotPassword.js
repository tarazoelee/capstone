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

  return (
    <div>
      {/* If there's an error, display it */}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          ref={emailRef} // Associating the input with the emailRef
          required
        />
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
}