import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    setError("");
    try {
      await logout().then(nav("/"));
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/3 items-center py-10 font-bold text-yellow-900 rounded-r-md bg-[#ffdd80]">
        <div>
          <div>History</div>
          <div>Home</div>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}
