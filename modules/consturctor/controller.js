import constructor from '../../models/constructor.js'
import {capitalizeFields} from '../../middlewares/Utility/utility.js'
import moment from 'moment'

export const createConstructor = async (req,res) => {
    try {
        const {name , totalAmount , payAmount  , type , date , linked , userId} = req.body
        const capitalizedData = capitalizeFields({ name , type }, ["name" , "type"]);
        const capitalName = capitalizedData.name;
        const capitalType = capitalizedData.type
    
        const remain = totalAmount - payAmount
        const formattedDate = moment(req.body.date, "DD/MM/YYYY").format("YYYY-MM-DD");

        
        const body={name:capitalName,totalAmount,payAmount,remainingAmount:remain,type:capitalType,date:formattedDate,linked,userId}
        const cons = await constructor.findOne({ name })
        if (cons) {
            return res.status(401).json({ message: "Already Exist" })
        }
        if (remain < 0) {
            return res.status(401).json({ message: "Please enter correct payment" })
        }
        const data = await constructor.create(body)
        res.status(200).json({message:"created successfully" , Data:data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while Creating Labourer"})
    }
}

export const getConstructor = async (req,res) => {
    try {
        const cons = await constructor.find()
        if (!cons.length) {
            return res.status(401).json({message:"Not Found"})
        }
        const aggregationResult = await constructor.aggregate([
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
        console.log(totalAmount, payAmount, remainingAmount);

        res.status(200).json({
             message: "Labourer Get Successfully", 
             Length: cons.length, 
             totalAmount, 
             payAmount, 
             remainingAmount,
             data: cons ,
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
        const {name , totalAmount , payAmount , type} = req.body
        const remain = totalAmount - payAmount
        const body = {
            name,
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
