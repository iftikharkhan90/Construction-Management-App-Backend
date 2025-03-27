import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotEnv from "dotenv";
import route from './Routes/userRoutes.js';

const app = express();

dotEnv.config();
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())

const PORT = process.env.PORT
const DB_URL = process.env.MONGO_DB

mongoose.connect(DB_URL).then(()=>{
    console.log("DataBase Connected");
    app.listen(PORT , ()=>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    })
}).catch((error)=>{
    console.log("Error" , error);
});

app.use('/api' , route );
