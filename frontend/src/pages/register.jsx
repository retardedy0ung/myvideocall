import axios from 'axios'
import './register.css'
import  { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Register() {
    const [username,setusername]=useState("")
    const [password,setpassword]=useState("")
  
let[errme,seterrme]=useState(null)
let navigate =useNavigate()


    let signup=async()=>{
        try{
            let response=await axios.post("https://myvideocall-r9jr.onrender.com/api/register",{username:username,password:password},{withCredentials:true})
    navigate("/",{state:{myname:response.data?.myname,message:response.data?.message,creator:response.data?.myid,loggedin:response.data?.logged}})
  console.log(response.data?.message)

        }catch(error){
seterrme(error.response.data?.message)
console.log(error.response.data?.message)
        }


    }
  return (
    <div className='registerpage'>
        <div className='registerouter'>
            <h1 className='h1register'>signup</h1>
            <fieldset>
                <legend>username</legend> <input type='text' name='username' onChange={(e)=>setusername(e.target.value)} value={username}/>
            </fieldset>
            
            <fieldset>
                <legend>password</legend> <input type='password' name='password' value={password}  onChange={(e)=>setpassword(e.target.value)}/>
            </fieldset>
            {
                errme &&<p className='err' >{errme}<span id='x' onClick={()=>seterrme("")}>   X</span></p>
            }
            <button onClick={signup}>sign-up</button>
        </div>
      
    </div>
  )
}

export default Register
