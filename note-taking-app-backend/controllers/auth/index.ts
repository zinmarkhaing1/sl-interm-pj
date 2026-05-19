import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import Auth from "../../models/Auth";

interface SignupBody {
  firstName : string;
  lastName : string;
  email : string;
  password:string;
}
export const signup = async (
  req : Request<{},{},SignupBody>,
   res : Response) : Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    const existingUser = await Auth.findOne({email});
    if (existingUser){
      res.status(400).json({
        success : false,
        message : "User already exists",
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAuth = new Auth({
      firstName,
      lastName,
      email,
      password: passwordHash,
      
    });
    const savedAuth = await newAuth.save();
    
    if (!process.env.JWT_SECRET){
      throw new Error("JWT_SECRET is missing");
    }
    const token = jwt.sign({ id: savedAuth._id }, process.env.JWT_SECRET, {expiresIn:"7d"});
    const authToReturn = savedAuth.toObject();
    delete (authToReturn as any).password;

    res.status(201).json({success:true,data :{token, auth:authToReturn},  });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
    console.log('err', err);
  }
}
interface LoginBody{
  email :string;
  password : string;
}

export const login = async (
  req:Request<{},{},LoginBody>, 
  res : Response) :Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email});
    if (!user){
      res.status(400).json({ msg: "User does not exist. " });
      return;
    } 

    const isMatch = await bcrypt.compare(
      password, 
      user.password);
    if (!isMatch) {
       res.status(400).json({ msg: "Invalid credentials. " });
       return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string,{expiresIn:"7d"}

    );
    const userToReturn = user.toObject();
    delete (userToReturn as any).password;
    res.status(201).json({ success:true, data:{token, user: userToReturn}, });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};