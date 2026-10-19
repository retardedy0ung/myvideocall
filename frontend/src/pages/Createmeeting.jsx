import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Createmeeting() {
    let [code,setcode]=useState("")
    let [room,setroom]=useState("")
    let navigate=useNavigate()
let location=useLocation()

    let create=async()=>{
        try{
          console.log("create",location.state?.creator)
                    let response= await axios.post("https://myvideocall-r9jr.onrender.com/api/create",{room:room,meetingcode:code,creator:location.state?.creator},{withCredentials:true})
                    let newmeetingcode=response.data?.mymeetingcode
                    console.log("created",newmeetingcode)

                  let set=true
                   navigate("/video",{state:{set:set,mymeetingcode:newmeetingcode,username:location.state?.username}})
                    setcode("")

        }catch(e){
            console.log(e.response?.data?.message)
        }

    }
  return (
    <div className='createmeetingouter'>
      <h1 className='h1create'>enter the meeting name and create-meeting-code</h1>
      <div className='thebuts'>
   <div>
        <fieldset>
        <legend>room-name</legend>
        <input type='text' value={room} onChange={(e)=>setroom(e.target.value)}></input>
        </fieldset>

      </div>
        <div>
            <fieldset>
            <legend>meetingcode</legend>
             <input type='text' value={code} onChange={(e)=>setcode(e.target.value)}></input>
            </fieldset>
      
      </div>
      </div>
   
      <div>
        <button onClick={create}>create</button>
      </div>
    </div>
  )
}

export default Createmeeting
