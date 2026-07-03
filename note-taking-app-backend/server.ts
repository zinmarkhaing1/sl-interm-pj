import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import helmet from 'helmet';

import authRoutes from "./routes/auth/auth";
import noteRoutes from "./routes/note";
import shareRoutes from "./routes/share";
import notificationRoutes from "./routes/notifications";




dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));





app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use('/notes',noteRoutes);
app.use('/api/notes',noteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/share', shareRoutes);



const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    throw new Error("MONGO_URL is missing. Add it to note-taking-app-backend/.env");
}

mongoose.connect(mongoUrl)
.then(async () => {
    app.listen(PORT,() => console.log(`Server Port : ${PORT}`));
    
})
.catch((error) => console.log(`${error} did not connect`));
