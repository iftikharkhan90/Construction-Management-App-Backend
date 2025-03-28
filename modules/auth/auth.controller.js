import { hash } from "bcryptjs";
import User from "../../models/user.js";
import bcrypt from 'bcryptjs'
import { createToken } from "./auth.service.js";
import user from "../../models/user.js";

export const signUp = async (req, res) => {
    try {
        console.log("ReqBody", req.body);
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: 'User (with same email) already exists'
            });
        }        
        const hashPassword = await hash(password, 10)
        const newUser = { ...req.body, password: hashPassword }
        await user.create(newUser);
        res.status(200).json({ message: "User created successfully", data: newUser });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error while signUp User', error });
    }
}

export const login = async(req,res)=>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email :email})
        if (!user) {
            return res.status(401).json({message:"Email id incorrect"})
        }
        const validPassword = await bcrypt.compare(password , user.password)
        if (!validPassword) {
            return res.status(401).json({message:"Password is incorrect"})
        }
        const token = await createToken(user._id);
        console.log("Token" , token);
        return res.status(200).json({message:'User Login Successfully' , data : user , token : token })
    } catch (error) {
        console.log("error" , error)
        return res.status(500).json({ message: 'Error while login User', error });
    }
}

