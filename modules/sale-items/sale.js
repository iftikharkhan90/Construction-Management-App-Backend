import material from "../../models/material";

export const createSaleItems = async(req,res) => {
    try {
        const {name , totalAmount} = req.body
        const body = {name  , totalAmount}

        return res.status(200).json({message:"Item created successfully" , Data:body})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while creating Material" })
    }
}

export const getSaleItem = async(req,res)=>{
    try {
        const {type} =  req.query
        const item = await material.find({type})
        if (!item.length == 0) {
            return res.status(401).json({message:"Not Found"})
        }

        return res.status(200).json({message:"Sale Items Fetched Successfully" , Data:item})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while creating Material" })
    }
}
