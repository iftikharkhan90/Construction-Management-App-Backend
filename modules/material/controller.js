import material from "../../models/material.js"
import mongoose from "mongoose";
import moment from "moment";

export const createMaterial = async (req, res) => {
    try {
        console.log(req.body);
        console.log("Try");

        var { itemName, itemPrice, totalItems, totalAmount, payAmount, type, date, linked, userId } = req.body;
        const mat = await material.findOne({ itemName , userId });
        if (mat) {
            return res.status(401).json({ message: "Already Exist!" });
        }
        const calculatedTotalAmount = totalAmount || (itemPrice * totalItems);
        const remaining = calculatedTotalAmount - payAmount;
        const formattedDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");

        const body = {
            itemName,
            itemPrice,
            totalItems,
            totalAmount: calculatedTotalAmount, 
            payAmount,
            remainingAmount: remaining, 
            type,
            date: formattedDate,
            linked,
            userId
        };

        if (remaining < 0) {
            return res.status(401).json({ message: "Please enter correct payment" });
        }
        const data = await material.create(body);
        res.status(200).json({
            message: "Data created successfully",
            DATA: data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while creating Material" });
    }
};


export const getMaterial = async(req,res) => {
    try {
        const { type , userId } = req.query  
        console.log("userId" , userId );
        const data = await material.find({ type, userId }).sort({ date: -1 })
        if (!data) {
            return res.status(401).json({message:"Not Found"});
        }else if (data.length === 0){
            return res.status(401).json({message:"Empty"});
        }
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const filter = { type, userId: userObjectId }
        const aggregationResult = await material.aggregate([
            { $match: filter},
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    payAmount: { $sum: "$payAmount" },
                    remainingAmount: { $sum: "$remainingAmount" }
                }
            }
        ]);
        
        const { totalAmount = 0, payAmount = 0, remainingAmount = 0 } = aggregationResult[0] || {};
        console.log(totalAmount , payAmount , remainingAmount);
        return res.status(200).json({
            message:"Material fetched successfully" ,  
            totalLength: data.length , 
            totalAmount,
            payAmount,
            remainingAmount,
            DATA: data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while get Material"})
    }
}

export const getMaterialById = async(req,res) =>{
    try {
        const id = req.params.id
        console.log("ID",id);
        const iD = await material.findById(id)
        if (!iD) {
            return res.status(401).json({message:"Material not found"})
        }
        res.status(200).json({message:"Material Fetched successfully" , Data:iD})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while Get Material By Id"})
    }
}

export const updateMaterial = async(req,res) => {
    try {
        const id = req.params.id
        console.log("ID" , id);
        const iD = await material.findById(id)
        if (!iD) {
            return res.status(401).json({message:"Material not Found"})
        }
        const { itemName, itemPrice, totalItems, totalAmount, payAmount, remainingAmount, type } = req.body
        var body = { itemName, itemPrice, totalItems, totalAmount, payAmount, remainingAmount, type }
        const amount = body.itemPrice * body.totalItems
        const remain = amount - body.payAmount
        var body = {
            itemName,
            itemPrice,
            totalItems,
            totalAmount:amount,
            payAmount,
            remainingAmount:remain,
            type
        }
        const newMaterial = await material.findByIdAndUpdate(id , body , {new:true})
        console.log('newMaterial', newMaterial)
        res.status(200).json({message:"Material Update Successfully" , Data:newMaterial})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while Update Material"})
    }
}

export const delMaterial = async (req, res) => {    
    try {
        const id = req.params.id
        const iD = await material.findById(id)
        if (!iD) {
            return res.status(401).json({message:"Material not found"})
        }
        const del = await material.findByIdAndDelete(id);
        res.status(200).json({message:"Material Delete Successfully"})
    } catch (error) {
        return res.status(500).json({message:"Error while deleting "})
    }
}
