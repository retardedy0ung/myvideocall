import mongoose from "mongoose";

let schema= mongoose.Schema
let regiterschema=new schema({
    username:{type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
let registerdata=mongoose.model("registerdata",regiterschema)
let historyschema=new schema({
timeout:{type:Date},
meetingtoken:{type:String}


})
let meetingschema=new schema({
 room:{type:String},
 meetingcode:{type:String},
 creator:{type:schema.Types.ObjectId,
    ref:registerdata
 },
 participants:[{
    type:schema.Types.ObjectId,
    ref:registerdata
 }]
 



})
let meetingdata=mongoose.model("meetingdata",meetingschema)
let historydata=mongoose.model("historydata",historyschema)

export {registerdata,historydata,meetingdata}