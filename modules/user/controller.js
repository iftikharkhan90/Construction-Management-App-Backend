import user from "../../models/user.js";


export const getAllUsers = async(req , res)=>{
    try {
        const users = await user.find();
        res.status(200).json({message:"Users fetched successfully" , data : users})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: 'Error while getAllUsers ', error });
    }
}
