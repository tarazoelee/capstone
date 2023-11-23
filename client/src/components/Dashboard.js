import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-full flex-col items-center">
      <div className="text-yellow-900 font-bold pl-16 py-20 self-start">
        {currentUser.email}
      </div>
       <div className="flex flex-col justify-center w-7/12 border mb-44 gap-7">
        <div className="font-bold text-3xl">Today's Byte</div>
         <div className="px-10 py-5 bg-orange-200">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like</div>
       </div>
      <hr></hr>
       <div className="flex flex-col font-bold justify-center text-3xl w-7/12 border">
          History
       </div>
    </div>
  
  );
}
