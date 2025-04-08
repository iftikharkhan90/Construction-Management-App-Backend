import mongoose from "mongoose";

const constructor = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    totalAmount:{
        type:Number,
        required:true
    },
    payAmount:{
        type:Number,
        required:true
    },
    remainingAmount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        // required:true
    },
    isLinked:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model('constructor' , constructor )
