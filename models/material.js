import mongoose from 'mongoose';

const material = new mongoose.Schema({
    itemName:{
        type:String,
        // required:true,
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: true,
    },
    itemPrice:{
        type:Number,
        // required:true
    },
    totalItems:{
        type:Number,
        // required:true
    },
    totalAmount:{
        type:Number,
        // required:true
    },
    payAmount:{
        type:Number,
        // required:true
    },
    remainingAmount:{
        type:Number,
        // required:true
    },
    type:{
        type:"String",
        required:true
    },
    date: {
        type: Date,
        // required: true
    },
    isLinked: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model('Building-Materials' , material);

