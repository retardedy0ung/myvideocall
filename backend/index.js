import express from'express'
import { Server } from 'socket.io'
import cors from'cors'
import http from 'http'
import mongoose from 'mongoose'
import router from './src/Route/Route.js'
import session from 'express-session'
import 'dotenv/config'
import url from'url'


let app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"https://myvideocall-1.onrender.com",
    credentials:true
}))
app.use(session({
    secret:process.env.SECRET_MY||"mysecret",
    resave:true,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    }
}))
const server=http.createServer(app)

const io= new Server(server,{
    cors:{
        origin:"https://myvideocall-1.onrender.com",
        credentials:true
    }
})
  let connection={}
  let messages={}
  let timeonline={}

io.on("connection",(socket)=>{
  
socket.on("joincall",(path,name)=>{
    console.log("JOIN REQUEST:", { path, name, socketId: socket.id });
if(connection[path]===undefined){
    connection[path]=[]
}

if (!connection[path].includes(socket.id)) {
  connection[path].push(socket.id);
}
console.log("ROOM KEY:", path); console.log("ALL CLIENTS:", connection[path]);
timeonline[socket.id]=new Date()
connection[path].forEach(elem=>
    io.to(elem).emit("userjoined",socket.id,name,connection[path])
)
if(messages[path]!==undefined){
for(let a=0;a<messages[path].length;a++){
  io.to(socket.id).emit("old-messages",messages[path][a]['sender'],messages[path][a]['data'],messages[path][a]['senderid'])
}

   
}


})
socket.on("signal",(id,candidate)=>{
    io.to(id).emit("signal",socket.id,candidate)
})
socket.on("chatmessages",(sender,data)=>{
    console.log("sender",sender)
    console.log("chatmessages triggered")
    const[matchingroom,found]=Object.entries(connection).reduce(([room,isfind],[roomkey,roomvalue])=>{
        if(!isfind&&roomvalue.includes(socket.id)){
            return [roomkey,true]
        }
     return [room,isfind]

    
    },["",false])
    if(messages[matchingroom]===undefined){
        
        messages[matchingroom]=[]
    }
    messages[matchingroom].push({sender:sender,data:data,senderid:socket.id})
   connection[matchingroom].forEach(elem=>{
        io.to(elem).emit("chat-messages",sender,data,socket.id)
    })


    
})
socket.on("disconnect",()=>{
    var key;
    for(const [k,v] of Object.entries(connection)){
        for(let a=0;a<v.length;a++){
            if(v[a]===socket.id){
                key=k

                connection[key].forEach((elm)=>{
                    io.to(elm).emit("leave",socket.id)
                    let index=connection[key].indexOf(socket.id)
                    connection[key].splice(index,1)
                    if(connection[key].length===0){
                        delete connection[key]
                    }
                })
            }
        }

    }
})
})

app.use("/api",router)


server.listen(process.env.PORT,()=>{
    console.log("listening")
    mongoose.connect(process.env.MURL).then(()=>{
        console.log("dbconnected")
    })
})
