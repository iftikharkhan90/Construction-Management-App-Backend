import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./Routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGO_DB || "mongodb://localhost:27017/mydatabase"; 
const allowedOrigins = [
    "http://localhost:5173",
    "https://fluffy-puffpuff-f11e26.netlify.app"
];

console.log("hi");

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("error");
            
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
console.log("oka");
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
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api", route);

export default app;
