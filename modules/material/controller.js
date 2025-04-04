import material from "../../models/material.js"

export const createMaterial = async(req,res)=>{
    try {
        console.log(req.body);
        console.log("Try");
        const { itemName, itemPrice, totalItems, totalAmount, payAmount, remainingAmount , type } = req.body;
        var body = { itemName, itemPrice, totalItems, totalAmount, payAmount, remainingAmount, type }
                const price = body.itemPrice
                const items = body.totalItems
                const amount = price *items
                const pay = body.payAmount
                const remaining = amount-pay
        var body = {
             itemName: itemName,
             itemPrice, 
             totalItems, 
             totalAmount: amount, 
             payAmount, 
             remainingAmount: remaining,
             type
           };
        if (remaining < 0) {
            return res.status(401).json({ message: "Please enter correct payment" })
        }
        // const item = await material.findOne({itemName , type})
        // console.log(item);
        
        // if (item) {
        //     console.log("Item Already Exist in Db ");
        //     return res.status(401).json({message:"Same Item Already Exist"})
        // }

        const data = await material.create(body);
        res.status(200).json({
            message:"Data created successfully",
            DATA : data
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Error while creating Material"})
    }
}

export const getMaterial = async(req,res) => {
    try {
        console.log("hlo");
        const { type } = req.query        
        const data = await material.find({type})
        if (!data) {
            return res.status(401).json({message:"Not Found"});
        }else if (data.length === 0){
            return res.status(401).json({message:"Empty"});
        }
        return res.status(200).json({
            message:"Material fetched successfully" ,  
            totalLength: data.length , 
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
