import React, { useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function CreateProfile() {
    const nav = useNavigate();
    const [topics, setTopics] = useState([])
    const { currentUser, logout } = useAuth();

    /**GETTING TOPICS ON FIRST LOAD */
    useEffect(()=>{
        getTopics()
    },[])

        /**GETTING ALL TOPICS FROM THE TOPICS COLLECTION */
    async function getTopics(){
        await fetch("http://localhost:5000/topics").then(
        response => response.json()
        ).then((data)=>{
        setTopics(data)
        }
        )
    }

    function navDash(){
        nav('/dashboard')
    }
    
    async function selectTopic(topic){
        console.log(topic)
        await fetch("http://localhost:5000/selectTopics",{
            method: "post",
            body: JSON.stringify({topic}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

  return (
    <div>
        {/* {currentUser} */}
       <div className='flex flex-col gap-2 items-center'>
          <div className='font-bold text-black'>What Topics Interest You?</div>
          <div className='italic text-black'>Choose 3</div>
          <div className='flex gap-10'>
            {
              topics.map((t)=>(
                <div
                className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                onClick={()=>selectTopic(t.topic)}
                > 
                    {t.topic} 
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default CreateProfile
