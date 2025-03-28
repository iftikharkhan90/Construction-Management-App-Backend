// import express from 'express';
// import cors from "cors";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import dotEnv from "dotenv";
// import route from './Routes/userRoutes.js';

// const app = express();

// dotEnv.config();
// app.use(cors({
//     origin:'*',
//     credentials: true
// }));
// app.use(express.urlencoded({extended:false}));
// app.use(bodyParser.json())

// const PORT = process.env.PORT
// const DB_URL = process.env.MONGO_DB

// mongoose.connect(DB_URL).then(()=>{
//     console.log("DataBase Connected");
//     app.listen(PORT , ()=>{
//         console.log(`Server is running on port http://localhost:${PORT}`);
//     })
// }).catch((error)=>{
//     console.log("Error" , error);
// });

// app.use('/api' , route );
// export default app;



import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./Routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGO_DB || "mongodb://localhost:27017/mydatabase"; 
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(" Database Connected");

        app.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(" Database Connection Error:", error);
        process.exit(1); 
    }
};

connectDB();

// Routes
app.use("/api", route);

export default app;
