import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Auth from "../models/Auth";

export const authId = new mongoose.Types.ObjectId();

interface AuthSeed {
    _id:mongoose.Types.ObjectId;
    firstName :string;
    lastName : string;
    email:string;
    password:string;
}
export const seedAuth = async ():Promise<void> => {
    
    const hashedPassword:string = await bcrypt.hash("zinmar123",10);

    const auth:AuthSeed = {
        _id:authId,
        firstName : 'Zin Mar',
        lastName : 'Khaing',
        email: "zinmarkhaing979@gmail.com",
        password : hashedPassword,

    };
    const existing = await Auth.findOne({email : auth.email});
    if (!existing) {
        await Auth.create(auth);
        console.log("Auth sedded");
        
    }else{
        console.log("Auth already exists");
        
    }
}

//for signup
// const { firstName, lastName, email, password } = req.body;
// const existingUser = await Auth.findOne({ email });
// if (existingUser) return res.status(400).json({ message: 'Email already exists' });
// const hashedPassword = await bcrypt.hash(password, 10);
// const newUser = new Auth({ firstName, lastName, email, password: hashedPassword });
// await newUser.save();

//login
// const { email, password } = req.body;
// const user = await Auth.findOne({ email });
// if (!user) return res.status(401).json({ message: 'Invalid credentials' });
