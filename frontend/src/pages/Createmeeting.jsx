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
                    let response= await axios.post("http://localhost:8000/api/create",{room:room,meetingcode:code,creator:location.state?.creator},{withCredentials:true})
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
    <div>
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
      <div>
        <button onClick={create}>create</button>
      </div>
    </div>
  )
}

export default Createmeeting
