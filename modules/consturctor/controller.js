import constructor from '../../models/constructor.js'
import {capitalizeFields} from '../../middlewares/Utility/utility.js'
import moment from 'moment'
import mongoose from 'mongoose'

export const createConstructor = async (req,res) => {
    try {
        const {itemName , totalAmount , payAmount  , type , date , linked , userId} = req.body
        const capitalizedData = capitalizeFields({ itemName , type }, ["itemName" , "type"]);
        const capitalitemName = capitalizedData.itemName;
        const capitalType = capitalizedData.type
        const remain = totalAmount - payAmount
        const formattedDate = moment(req.body.date, "DD/MM/YYYY").format("YYYY-MM-DD");
        
        if (remain < 0) {
            return res.status(401).json({ message: "Please enter correct payment" })
        }
        const body={itemName:capitalitemName,totalAmount,payAmount,remainingAmount:remain,type:capitalType,date:formattedDate,linked,userId}
        const data = await constructor.create(body)
        res.status(200).json({message:"created successfully" , Data:data , userId:userId})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while Creating Labourer"})
    }
}

export const getConstructor = async (req,res) => {
    try {
        const {userId} = req.query
        const cons = await constructor.find({ userId }).sort({ date: -1 })
        if (!cons.length) {
            return res.status(401).json({message:"Not Found"})
        }
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const filter = {userId:userObjectId}
        const aggregationResult = await constructor.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    payAmount: {
                        $sum: {
                            $add: [
                                { $ifNull: ["$payAmount", 0] },
                                { $ifNull: ["$linkedAmount", 0] }
                            ]
                        }
                    },            
                    remainingAmount: { $sum: "$remainingAmount" }
                }
            }
        ]);

        const { totalAmount = 0, payAmount = 0, remainingAmount = 0 } = aggregationResult[0] || {};
        console.log(totalAmount, payAmount, remainingAmount);

        const consItems = await constructor.find({
            // type,
            userId,
            remainingAmount: { $gt: 0 },
            isLinked: false,
        }).sort({ date: -1 })
        console.log("Constructor's items:", consItems)
        if (consItems.length === 0) {
            return res.status(404).json({ message: "Items not found" });
        }

        res.status(200).json({
             message: "Labourer Get Successfully", 
             Length: cons.length, 
             totalAmount, 
             payAmount, 
             remainingAmount,
             data: cons ,
             selectedItems:consItems
            })
    } catch (error) {
        console.log(error);        
        return res.status(500).json({message:"Error while get Labourer"})
    }
}

export const updateConstructor = async (req,res) => {
    try {
        const id = req.params.id
        const iD = await constructor.find({_id:id})
        if (!iD) {
            return res.status(404).json({message:"Constructor not Found"})
        }
        const {itemName , totalAmount , payAmount , type} = req.body
        const remain = totalAmount - payAmount
        const body = {
            itemName,
            totalAmount,
            payAmount,
            remainingAmount: remain,
            type
        }

        const data = await constructor.findByIdAndUpdate(id , body , {new:true})

        res.status(200).json({message:"Constructor Upadate Successfully" , Data:data})

    } catch (error) {
        console.log(error);
        return res.status().json({message:"Error while update Labourer"})
    }
}

export const deleteConstructor = async (req,res) => {
    try {
        const id = req.params.id
        const iD = await constructor.find({_id:id})
        if (!iD) {
            return req.status(404).json({message:"Constructor not Found"})
        }
        console.log("ok");
        
        const del = await constructor.findByIdAndDelete(id)
        res.status(200).json({message:"Constructor Delete Successfully"})

    } catch (error) {   
        console.error(error);
        
        return res.status(500).json({message:"Error while deleting Labourer"})
    }
}
