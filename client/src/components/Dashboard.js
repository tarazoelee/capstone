import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/3 items-center py-10 font-bold text-yellow-900 rounded-r-md bg-[#ffdd80]">
       <div>{currentUser.email}</div>
       <div>
          <div>History</div>
          <div>Home</div>
       </div>
      </div>
      

    </div>
  
  );
}
