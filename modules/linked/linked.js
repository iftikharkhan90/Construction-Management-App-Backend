import material from "../../models/material";

export const createLinkedItem = async(req,res)=>{
    try {
        const { payAmount , date , type , linked , userId} = req.body
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while get Material" })
    }
}

export const getLinkedItem = async(req,res)=>{
    try {
        const { type } = req.query
        const data = await material.find({ type })
        if (!data) {
            return res.status(401).json({ message: "Not Found" });
        } else if (data.length === 0) {
            return res.status(401).json({ message: "Empty" });
        }

        return res.status(200).json({message:"Fetched Successfully" , Data:data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while get Material" })
    }
}


