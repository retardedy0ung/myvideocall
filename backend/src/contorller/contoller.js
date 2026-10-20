import { meetingdata, registerdata } from "../mongoose/datas.js";
import bcrypt, { hash } from 'bcrypt'
import crypto  from 'crypto'
let registering=async(req,res)=>{
    let {username,password}=req.body;
    if(!username||!password){
        console.log("enetr err")
       return res.status(404).json({message:"please enter your details"})
       
    }
    let available=await registerdata.findOne({username})
    if(available){
                console.log("name err")
        return res.status(404).json({message:"give a unique name,this is already available"})

    
    }
    if(password&&username){
const userpassword =await bcrypt.hash(password,10)
let newuser=new registerdata({
    username:username,
    password:userpassword
})
let usernew=await newuser.save()
req.session.userId=usernew._id
   return res.status(200).json({myname:username,message:"saved",myid:req.session.userId,logged:true})
   


    }



}

let login=async(req,res)=>{
    let {username,password}=req.body
    
  
    let available=await registerdata.findOne({username})
    if(available){
        console.log(username);
console.log(available);
console.log(available?.password);
        let correct= await bcrypt.compare(password,available.password)
        if(correct){
            req.session.userId=available._id.toString()
            req.session.save()
            return res.status(200).json({message:"logged-in",myname:username,myid:req.session.userId,logged:true})
        }  else{
      return  res.status(400).json({message:"wrong password"})
    }
    }
    else{
       return res.status(400).json({message:"user not found"})
    }
}

let createmeeting=async(req,res)=>{
    try{
 let {room,meetingcode}=req.body
     if (!room || !meetingcode ) {
      return res.status(400).json({
        message: "Room, meeting code, and creator are required"
      });
    }
   console.log("CREATOR RECEIVED:", creator);
console.log("DATABASE:", mongoose.connection.name);

    let creator=req.session.userId
    let result= await registerdata.findById(creator) 
     if (!result) {
      return res.status(404).json({
        message: "User is not registered"
      });
    }
     let code=crypto.randomBytes(2).toString('hex').toUpperCase()
    let newcreator=new meetingdata({
        room:room,
        meetingcode:`${meetingcode}-${code}`,
        creator:creator
    })
    let creatorname=result.username 
    await newcreator.save()
    console.log(newcreator)
    console.log(newcreator.meetingcode)
    return  res.status(200).json({mymeetingcode:newcreator.meetingcode,myname:creatorname})
    }catch(e){
        res.status(500).json({message:`failed to create meeting${e}`})
    }
   
   
}


let middle=(req,res,next)=>{
    if(!req.session.userId){
        return res.status(400).json({message:"notloggedin",loggedin:false})
    }
    next()
}



let saveparticipants=async(req,res)=>{
let {meetingcode,participant}=req.body
if(meetingcode){
    let result =await meetingdata.findOne({meetingcode})
    if(result){
    if(result.participants.includes(participant)){
    return res.json({message:"alredy exist"})
    } else{
    result.participants.push(participant)
    await result.save()
    return res.status(200).json({message:"included into meeting",room:result.room})
    }
    }
    else{
        return res.status(400).json({message:"meeting doesnt exist"})
    }
}
}
export{registering,login,createmeeting,saveparticipants,middle}