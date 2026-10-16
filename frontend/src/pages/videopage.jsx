import  { useEffect, useRef, useState } from 'react'
import './video.css'
import io from'socket.io-client'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'




let serverurl="https://myvideocall-r9jr.onrender.com/"
function Videopage() {
  let localvideo=useRef()
  let location=useLocation()
  let navigate=useNavigate()
  let user=location.state?.username
  let participant=location.state?.participant
  let set=location.state?.set
  let getmeetingcode=location.state?.mymeetingcode
  
  let [err,seterr]=useState("")
  let[room,setroom]=useState("")
  let [copy,setcopied]=useState(false)
  

  
  let[videos,setvideos]=useState([])
  let[connects,setconnect]=useState(false)
 
  let[meetingcode,setmeetingcode]=useState("")
  let[audioavailable,setaudioavailable]=useState(true)
  let[videoavailable,setvideoavailable]=useState(true)
  let[messagecolor,setmessagecolor]=useState()
  let[audiocolor,setaudiocolor]=useState(false)
  let[videocolor,setvideocolor]=useState(false)
  let[screencolor,setscreencolor]=useState(false)
  let[messages,setmessages]=useState([])
  let[message,setmessage]=useState("")
 
  let[newmessage,setnewmessage]=useState(0)
  let[audio,setaudio]=useState()
  let[video,setvideo]=useState()
  let[screen,setscreen]=useState()
  let[screenavailable,setscreenavailable]=useState()


let socketref=useRef()
let socketidref=useRef()
let connections=useRef([])
let videoref=useRef([])
let peerconfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};
let getpermission = async () => {
  try {

    let media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    window.localStream = media

   

    setaudioavailable(true)
    setvideoavailable(true)

    if (navigator.mediaDevices.getDisplayMedia) {
      setscreenavailable(true)
    } else {
      setscreenavailable(false)
    }

  } catch (error) {

    console.log("permission error:", error)

    setaudioavailable(false)
    setvideoavailable(false)
  }
}
useEffect(()=>{
  getpermission()
},[])
useEffect(() => {
  if (connects && localvideo.current && window.localStream) {
    localvideo.current.srcObject = window.localStream
  }
}, [connects])
let icecandidate=useRef([])

let handlesignal=async(id,info)=>{
  let signal=JSON.parse(info)
  console.log("handle signal")
  if(id!==socketidref.current){
    console.log(id)
    console.log("signal sdp",signal.sdp)
    if(signal.sdp){
      console.log("sdp")
    await connections.current[id].setRemoteDescription(new RTCSessionDescription(signal.sdp))
    if(icecandidate.current[id]){
      for(let candidate of icecandidate.current[id]){
        console.log("addice")
        await connections.current[id].addIceCandidate(new RTCIceCandidate(candidate))
      }
      delete icecandidate.current[id]
    }
    if(signal.sdp.type==="offer"){

      connections.current[id].createAnswer().then((description)=>{
        console.log("creating answer")
        connections.current[id].setLocalDescription(description).then(()=>{
          socketref.current.emit("signal",id,JSON.stringify({'sdp':connections.current[id].localDescription}))
        })
      })
    }
      
    }
    if(signal.ice){
      console.log("ice")
      if(connections.current[id].remoteDescription){
        connections.current[id].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>e)
      }else{
        if(!icecandidate.current[id]){
          icecandidate.current[id]=[]
        }
        
      let ice=  icecandidate.current[id].push(signal.ice)
        console.log("storing ice",ice)
      }
    }
  }

}



let getDisplayMediasuccess=(stream)=>{

  try{
    window.localStream.getTracks().forEach(track=>track.stop())

  }catch(e){console.log(e)}
  window.localStream=stream
  localvideo.current.srcObject=stream
  for(let id in connections.current){
    if(id===socketidref.current)continue
    try{
      connections.current[id].addStream(window.localStream)
       connections.current[id].createOffer().then((des)=>{
        connections.current[id].setLocalDescription(des).then(()=>{
socketref.current.emit("signal",id,JSON.stringify({'sdp':connections.current[id].localDescription}))
        })
      })

    }catch(e){console.log(e)}}

    stream.getTracks().forEach(track=>track.onended=async()=>{
      setscreen(false)
        setscreencolor(false)
      try{
        let old=window.localStream
        let news=await navigator.mediaDevices.getUserMedia({video:true,audio:audio})
        window.localStream=news
        localvideo.current.srcObject=news
        await sendStreamToPeers(news,old)

      }catch(e){console.log(e)}


    })
  

}
let getDisplayMedia=async()=>{
if(screen){
 try{
  await navigator.mediaDevices.getDisplayMedia({video:true,audio:true}).then(getDisplayMediasuccess).then((stream)=>{})
 } catch(error){
  if(error.name==="NotAllowedError"){
    setscreen(false)
    setscreencolor(false)
    console.log("not allowed")
  }
 }
}
}

useEffect(()=>{
  if(screen!==null&&screen!==undefined){
  getDisplayMedia()
  }
},[screen])

let handleleave=(id)=>{
setvideos(videos=>videos.filter(video=>video.socketId!==id))
}
let handlemessages=(sender,data,id)=>{
  console.log("getting messages")
  console.log("getting messages")
  console.log("sender:", sender)
  console.log("data:", data)
  console.log("id:", id)
setmessages((messages)=>{
  console.log("messagedata",messages)
 return [ ...messages,{sender:sender,data:data}]
 
}
   
)

if(id!==socketidref.current){
   console.log("message",newmessage)
setnewmessage(prenewmessage=>prenewmessage+1)}
   console.log("message",newmessage)


}

let connectserver=(roomjoin)=>{
    socketref.current=io.connect(serverurl,{secure:false})
    console.log("connecting")
    socketref.current.on("signal",handlesignal)
    socketref.current.on("chat-messages",handlemessages)
    socketref.current.on("connect",()=>{
      socketref.current.emit("joincall",roomjoin,user)
      console.log("joincallroom",room)
      socketidref.current=socketref.current.id
      socketref.current.on("old-messages",handlemessages)
      socketref.current.on("leave",handleleave)
    })

    socketref.current.on("userjoined",(id,clientname,clients)=>{
      clients.forEach(clientid=>{
        console.log("MY SOCKET:", socketidref.current)
    console.log("JOINED SOCKET:", id)
    console.log("CLIENTS:", clients)

     console.log("someone joined call")

        if(clientid===socketidref.current) return
    
if(! connections.current[clientid]){
connections.current[clientid]=new RTCPeerConnection(peerconfig)
}

 
        connections.current[clientid].onicecandidate=function(event){
          console.log("on ice")
          if(event.candidate!==null){ 
              console.log("ice:",event.candidate)
            socketref.current.emit("signal",clientid,JSON.stringify({'ice':event.candidate}))
         
          }

        }
        connections.current[clientid].onaddstream = (event)=>{
          console.log("onaddstream")
          console.log("REMOTE STREAM:", event.stream);
  setvideos(videos=>{
  let exist=videos.some(video=>video.socketId===clientid)
  if(exist){
           console.log("FOUND EXISTING");
  let updated= videos.map(video=>
  video.socketId===clientid?{...video,stream:event.stream,name:clientname}:video
  )
videoref.current=updated
console.log("vr",videoref.current)
   return updated

  }
  else{
    let newid={
      socketId:clientid,
      stream:event.stream,
      name:clientname,
      autoPlay:true,
      playsInline:true
    }

    let updated=[...videos,newid]
   

videoref.current=updated
console.log("new:",updated)
return updated
  }
})

}
        if(window.localStream!==null&&window.localStream!==undefined){
          console.log("addstream")
          connections.current[clientid].addStream(window.localStream)

        }else{
          let blacksilence=(...args)=>new MediaStream([black(...args),silence()])
          window.localStream=blacksilence()
          localvideo.current.srcObject=window.localStream
              connections.current[clientid].addStream(window.localStream)

        }
      }
    )
      if(id===socketidref.current){
        for(let id2 in connections.current){
          if(id2===socketidref.current)continue
          try{
connections.current[id2].createOffer().then((description)=>{
  connections.current[id2].setLocalDescription(description).then(()=>{ console.log("creatingoffer")
  console.log(connections.current[id2].localDescription)
 let ans= socketref.current.emit("signal",id2,JSON.stringify({'sdp':connections.current[id2].localDescription}))
 console.log("ans",ans)})
 
})
          }catch(e){ console.log("error in id2:",e)}


        }
      }


    

    })
    

  }
  let black = ({width = 640, height = 480} = {}) => {
  let canvas = document.createElement("canvas")

  canvas.width = width
  canvas.height = height

  let context = canvas.getContext("2d")

  // Make the canvas black
  context.fillStyle = "black"
  context.fillRect(0, 0, width, height)

  // Capture canvas as video
  let stream = canvas.captureStream(30)

  return stream.getVideoTracks()[0]
}
  let silence=()=>{
    let ctx=new AudioContext()
    let oscillator=ctx.createOscillator()
    let dst=oscillator.connect(ctx.createMediaStreamDestination())
   oscillator.start()
     ctx.resume()
     return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false})
  }


  let handlemymessage=()=>{
setmessagecolor(!messagecolor)
setnewmessage(0)
  }


let sendStreamToPeers = async(stream,old) => {


  for(let id in connections.current){

    if(id === socketidref.current) continue

    try{
      if(old){
             connections.current[id].removeStream(old)
      }

      connections.current[id].addStream(stream)

      if(connections.current[id].signalingState !== "stable"){
        console.log(
          "Cannot create offer:",
          id,
          connections.current[id].signalingState
        )
        continue
      }

      let description =
        await connections.current[id].createOffer()

      await connections.current[id].setLocalDescription(description)

      socketref.current.emit(
        "signal",
        id,
        JSON.stringify({
          sdp: connections.current[id].localDescription
        })
      )
   

    }catch(e){
      console.log("send stream error:",e)
    }
  }
}

  let handlemyvideo=async()=>{
   
setvideocolor(!videocolor)
 if(video){
  setvideo(false)
  
 let audioTracks = window.localStream?.getAudioTracks() || []
let old=window.localStream
let stream = new MediaStream([
  black(),
  ...audioTracks
])

  window.localStream=stream
  localvideo.current.srcObject=stream
  await sendStreamToPeers(stream,old)

  }else{

setvideo(true)
let old=window.localStream
let stream = await navigator.mediaDevices.getUserMedia({
video: true,
audio: audio
})
window.localStream = stream

    // YOU see camera
localvideo.current.srcObject = stream

    // FRIENDS see camera
await sendStreamToPeers(stream,old)
}
}
  
let handleendcall=()=>{
try{
let tracks=localvideo.current.getTracks()
tracks.forEach(track=>track.stop())
}catch(e){console.log(e)}
window.location.href="/"

  }
let handlemyaudio=async()=>{
setaudiocolor(!audiocolor)
if(audio){
setaudio(false)
let old=window.localStream
let videoTracks = window.localStream?.getVideoTracks() || []
let stream = new MediaStream([
  ...videoTracks,
silence()
])
console.log("stream:", stream)
console.log("is MediaStream:", stream instanceof MediaStream)
window.localStream=stream
localvideo.current.srcObject=stream
await sendStreamToPeers(stream,old)

  }else{

    setaudio(true)

let old=window.localStream
let stream = await navigator.mediaDevices.getUserMedia({
      video:video,
      audio: true
    })

    window.localStream = stream

    // YOU see camera
    localvideo.current.srcObject = stream

    // FRIENDS see camera
    await sendStreamToPeers(stream,old)
  }
  }
let handlemyscreen=()=>{
setscreencolor(!screencolor)
setscreen(!screen)
  }
let addmessage=()=>{
    console.log("addingmessages")
try{
  console.log("user ending",user)
socketref.current.emit("chatmessages",user,message)
setmessage("")




}catch(e){console.log("message error:",e)}
}

let checkmeetingcode=async()=>{
  console.log("checking code")
try{
let response=await axios.post("http://localhost:8000/api/addparticipant",{meetingcode:meetingcode,participant:participant},{withCredentials:true})
console.log("room",response.data?.room)
let roomjoin=response.data?.room
console.log(roomjoin)
if (!roomjoin) {
  console.error("No room returned by the API");
  seterr("Room name is missing");
  return;
}

setroom(roomjoin);
setconnect(true);
setaudio(audioavailable);
setvideo(videoavailable);

connectserver(roomjoin);

setmeetingcode("")
seterr("")

  }catch(e){
    if(e.response?.data?.loggedin===false){
          seterr(e.response?.data?.message)
          navigate("/login",{
            state:{
              from:location.pathname
            }
          })
    }

console.log(e.response?.data?.message)
  }

}
let handlecopy=async()=>{
await navigator.clipboard.writeText(location.state?.mymeetingcode)
setcopied(true)
setTimeout(()=>{
setcopied(false)
 },2000)
}
  return (
    <div className='video'>
    
{
  connects===false?
  <div>
  <input type='text' value={meetingcode} onChange={(e)=>setmeetingcode(e.target.value)}></input><button  onClick={checkmeetingcode}>connect</button>
  {
  err?<><p className='error'>{err}</p></>:<></>
  }</div>
  :
<div className='videopage'>
 {
    set===true?<span>{getmeetingcode}<button onClick={handlecopy}>copy</button></span>:<></>
 }
<div className='videomessage'>
<div  className={messagecolor===true?'realvideos':'realvideosx'}>
<div className='divvid'><video className='localvid' ref={localvideo} autoPlay playsInline></video></div>

{videos.map(video=>{
  return <div className='divvid' key={video.socketId}><video  key={video.socketId} className='localvid' muted autoPlay ref={ref=>{if(ref&&video.stream){
  ref.srcObject= video.stream

  }} }></video></div>})}
 
    </div>
    <div className={messagecolor===true?'message':'messageremove'}>
    <div className='messindex'>
   {
    messages.length!==0?messages.map((message,index)=>{
      return<div key={index}><p>{message.sender}</p><p>{message.data}</p><br></br></div>
    }):<p>no message yet</p>

   }
   </div>
   <div className='text'>
    <input type='text' value={message} onChange={(e)=>setmessage(e.target.value)}></input>
    <button onClick={addmessage}>send</button>
    </div>
    </div>
    </div>
    <div className='options'>
      <button  className={videocolor===true?"green":"gray"} onClick={handlemyvideo}>video</button>
      <button className={audiocolor===true?"green":"gray"} onClick={handlemyaudio}>audio</button>
      <button className='red' onClick={handleendcall}>end</button>
      <button className={screencolor===true?"green":"gray"} onClick={handlemyscreen}>screen</button>
      <button className={messagecolor===true?"green":"gray"} onClick={handlemymessage}>mesage<span className={newmessage!==0?'show':'noshow'}>{newmessage}</span></button>
    </div>
  </div>
}
      
    </div>
  )
}

export default Videopage
