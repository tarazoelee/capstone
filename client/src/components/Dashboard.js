import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div>{currentUser.email}</div>
  
  );
}
