import material from "../../models/material.js";
import moment from "moment";

export const createSaleItems = async(req,res) => {
    try {
        const {itemName , totalAmount , type , date , userId} = req.body
        const formattedDate = moment(req.body.date, "DD/MM/YYYY").format("YYYY-MM-DD");
        const body = {itemName  , totalAmount , type , date:formattedDate , userId}
        const data = await material.create(body);

        return res.status(200).json({message:"Item created successfully" , Data:data , userId:userId})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while creating Material" })
    }
}

export const getSaleItem = async(req,res)=>{
    try {
        const {type , userId} =  req.query
        const item = await material.find({type , userId})
        if (!item.length == null) {
            return res.status(401).json({message:"Not Found"})
        }

        return res.status(200).json({message:"Sale Items Fetched Successfully" , Data:item})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while creating Material" })
    }
}
