import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from 'helmet';

import authRoutes from "./routes/auth/auth";
import noteRoutes from "./routes/note";
import taskRoutes from "./routes/notecategory";



dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));




//routes
app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use('/notes',noteRoutes);
app.use('/api/notes',noteRoutes);
app.use('/api/auth',authRoutes);
app.use('/tasks',taskRoutes);
app.use('/api/tasks',taskRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL as string)
.then(async () => {
    app.listen(PORT,() => console.log(`Server Port : ${PORT}`));
    
})
.catch((error) => console.log(`${error} did not connect`));
