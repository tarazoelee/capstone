import React, { useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";

function Profile() {
  const nav = useNavigate();
  const [topics, setTopics] = useState([])

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

  function saveChanges(){

  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='self-start pl-16 gap-3 my-20 h-20 text-yellow-900 font-bold'>
        <button onClick={navDash}>Dashboard</button>
      </div>
      <div className='text-black flex flex-col gap-12 justify-center items-center'>
        <div className='flex gap-10 text-yellow-900 font-bold'>
          <div>User since November 2023</div>
        </div>

        <div className='flex gap-10 items-center'>
          <div>Account Email</div>
          <div className='bg-gray-100 rounded-md px-28 py-2 text-xs'>account@email.com</div>
        </div>

        <div className='flex gap-10 items-center'>
          <div>Podcast Email</div>
          <div className='bg-gray-100 rounded-md px-28 py-2 text-xs'>podcast@email.com</div>
        </div>

        <div className='flex gap-10 items-center'>
          <div>Your Interests</div>
          <div className='flex gap-10'>
            {
              topics.map((t)=>(
                <div className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'> {t.topic} </div>
              ))
            }
          </div>
        </div>

        <div className='flex gap-10'>
          <div>Podcast Length</div>
          <div>...</div>
        </div>

        <div className=''>
          <button onClick={saveChanges} className='bg-gray-100 p-4'>Save</button>
        </div>

      </div>
    </div>
  )
}

export default Profile