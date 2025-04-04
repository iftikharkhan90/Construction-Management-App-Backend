import mongoose from 'mongoose';

const material = new mongoose.Schema({
    itemName:{
        type:String,
        requiredd:true
    },
    itemPrice:{
        type:Number,
        required:true
    },
    totalItems:{
        type:Number,
        required:true
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
        type:"String",
        required:true
    }
})

export default mongoose.model('Building-Materials' , material);

