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
    
    async function selectTopic1(topic){
        console.log(topic)
        const topicDiv = document.getElementById(`${topic}`+'1');
        topicDiv.style.backgroundColor='orange'
        await fetch("http://localhost:5000/selectTopic1",{
            method: "post",
            body: JSON.stringify({topic: topic, email: currentUser.email}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async function selectTopic2(topic){
        console.log(topic)
        const topicDiv = document.getElementById(`${topic}`+'2');
        topicDiv.style.backgroundColor='orange'
        await fetch("http://localhost:5000/selectTopic2",{
            method: "post",
            body: JSON.stringify({topic: topic, email: currentUser.email}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async function selectTopic3(topic){
        console.log(topic)
        const topicDiv = document.getElementById(`${topic}`+'3');
        topicDiv.style.backgroundColor='orange'
        await fetch("http://localhost:5000/selectTopic3",{
            method: "post",
            body: JSON.stringify({topic: topic, email: currentUser.email}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    //getLength here 
    var length="2 min";

    async function selectLength(l){
        if (length==l){
            const lengthDiv = document.getElementById(l);
            lengthDiv.style.backgroundColor = 'orange'
        }
    }

    async function Home(){
        nav('/')
    }
  return (
    <div className='flex flex-col justify-center items-center min-h-full gap-12'>
        {/* {currentUser} */}
       <div className='flex flex-col gap-2 items-center w-1/2'>
          <div className='font-bold text-black'>What Topics Interest You?</div>

          <div className='italic text-black mt-10'>Topic 1</div>
          <div className='flex gap-10 flex-wrap items-center justify-center'>
            {
              topics.map((t)=>(
                <div
                id={t.topic+'1'}
                className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                onClick={()=>selectTopic1(t.topic)}
                > 
                    {t.topic} 
                </div>
              ))
            }
          </div>

          <div className='italic text-black mt-10'>Topic 2</div>
          <div className='flex gap-10 flex-wrap items-center justify-center'>
            {
              topics.map((t)=>(
                <div
                id={t.topic+'2'}
                className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                onClick={()=>selectTopic2(t.topic)}
                > 
                    {t.topic} 
                </div>
              ))
            }
          </div>

          <div className='italic text-black mt-10'>Topic 3</div>
          <div className='flex gap-10 flex-wrap items-center justify-center'>
            {
              topics.map((t)=>(
                <div
                id={t.topic+'3'}
                className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                onClick={()=>selectTopic3(t.topic)}
                > 
                    {t.topic} 
                </div>
              ))
            }
          </div>
        </div>
        <div className='flex flex-col gap-2 items-center w-1/2'>
             <div className='font-bold text-black'>How long do you want your daily updates?</div>
             <div className='flex gap-10 flex-wrap items-center justify-center'>
                <div className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded' 
                    id = "2 min"
                    onClick={()=> selectLength("2 min")}> 1-2 min</div>
                <div className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                    id = "5 min"
                    onClick={()=> selectLength("5 min")}> 2-5 min </div>
                <div className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                    id = "10 min"
                    onClick={()=> selectLength("10 min")}>5-10 min</div>
                <div className='bg-orange-100 w-32 px-6 py-2 text-center rounded-med rounded'
                    id = "20 min"
                    onClick={()=> selectLength("20 min")}>10-20 min</div>
             </div>
        </div>
        <div>
            <button onClick={Home}>Done</button>
        </div>
    </div>
  )
}

export default CreateProfile
