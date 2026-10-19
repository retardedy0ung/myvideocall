import axios from 'axios'
import  { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './login.css'
function Login() {
    let [password,setpassword]=useState("")
    let [username,setusername]=useState("")
    let [err,seterr]=useState("")
    let navigate=useNavigate()
    let location=useLocation()

    let login=async()=>{
      
        try{
       let response=await axios.post("https://myvideocall-r9jr.onrender.com/api/login",{username:username,password:password},{withCredentials:true})
       let logged=response.data?.message 
   console.log("login",response.data?.myid)
       if(logged==="logged-in"){
             navigate(location.state?.from||"/",{state:{myname:username,loggedin:response.data?.logged,userid:response.data?.myid}}) 
             console.log("home",response.data?.myid)
             
       }
      
        }catch(error){
seterr(error.response?.data?.message)
console.log(error.response?.data?.message)

        }
       
    }
  return (
    <div className='loginouter'>
      <div className='content'>
        <h1 className='h1login'>Login</h1>
          <fieldset>
            <legend>username</legend>
            <input type='text' value={username} onChange={(e)=>setusername(e.target.value)}></input>
        </fieldset>
        <fieldset>
            <legend>password</legend>
            <input type='password' value={password} onChange={(e)=>setpassword(e.target.value)}></input>
        </fieldset>
         {
            err &&<p>{err}<span onClick={()=>seterr("")}>    x</span></p>
        }
        <button onClick={login}>login</button>
         <p>---OR---</p>
           <Link to={"/register"} state={{pathname:location.state?.from}}>register</Link>

       
      
      </div>
    </div>
  )
}

export default Login
