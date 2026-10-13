

import './home.css'
import { Link, useLocation } from 'react-router-dom'

function Home() {

    let location=useLocation()
    let logged=location.state?.loggedin
    let user=location.state?.myname
   
  
    
  return (
    <div className='home'>
      <div className='header'>
        <div className='h1'><h1 className='mycall'>mycall<span className='dot'>.</span></h1></div>

             {logged===true?<div className='loginregister'><div><button className='call'>logout</button></div>
             <div ><Link className='link' state={{creator:location.state?.userid,username:user}} to={"/create"}><button className='call'>create-room</button></Link></div>
                          <div><Link className='link' state={{username:user,participant:location.state?.userid}} to={"/video"}><button className='call'>join-call</button></Link></div>
                                  <div className='useraccount'><div className='userdiv'><div className='user'>{user&&user[0].toUpperCase()}</div></div> 
       <div><p className='name'>{ user&&user}</p></div> </div></div>
             :  <div className='loginregister'>

              <div><Link  className='link' to={"/login"}><button className='call'>log-in</button></Link></div>
              <div><Link  className='link' to={"/register"}><button className='call'>sign-up</button></Link></div>
            </div>}
           

       
       </div>

       <div>
        <h1>
          welcome to MYCALL!
        </h1>
        <p>enjoy a moment a look and a gesture to say i miss you and i see you</p>
       </div>
       <div>
        <img src='/profile.jpg' alt='apic'>
        </img>
       </div>
  
  
      
    </div>
  )
}

export default Home
