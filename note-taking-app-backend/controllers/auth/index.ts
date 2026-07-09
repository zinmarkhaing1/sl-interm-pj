import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import Auth from "../../models/Auth";
import Note from "../../models/Note";
import ShareInvitation from "../../models/ShareInvitation";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import Notification from "../../models/Notification";

interface SignupBody {
  firstName : string;
  lastName : string;
  email : string;
  password:string;
}

const acceptPendingInvites = async (email: string, userId: string) => {
  const pendingInvites = await ShareInvitation.find({
    invitedEmail: email.toLowerCase(),
    status: "pending",
  }).lean();

  if (pendingInvites.length === 0) {
    return;
  }

  await ShareInvitation.updateMany(
    { invitedEmail: email.toLowerCase(), status: "pending" },
    { $set: { status: "accepted", userId, updatedAt: new Date() } },
  );

  const accessEntries = [] as Array<{ userId: string; noteId: string; permission: "view" | "comment" | "edit"; grantedBy: string }>;

  for (const invite of pendingInvites) {
    const inviterNotes = await Note.find({ user: invite.invitedBy }).select("_id");
    const permission = invite.role === "editor" ? "edit" : invite.role === "commenter" ? "comment" : "view";

    for (const note of inviterNotes) {
      accessEntries.push({
        userId: userId,
        noteId: note._id.toString(),
        permission,
        grantedBy: invite.invitedBy.toString(),
      });
    }
  }

  if (accessEntries.length > 0) {
    await WorkspaceAccess.deleteMany({ userId, noteId: { $in: accessEntries.map((entry) => entry.noteId) } });
    await WorkspaceAccess.insertMany(accessEntries);
  }
  // Create notifications for the user about accepted invitations
  try {
    for (const invite of pendingInvites) {
      await Notification.create({
        fromUser: invite.invitedBy,
        toUser: userId,
        type: "invite",
        message: `You were granted access (role: ${invite.role}) to a collaborator's notes.`,
      });
    }
  } catch (err) {
    // Ignore notification creation errors
  }
};

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
    await acceptPendingInvites(savedAuth.email, savedAuth._id.toString());
    
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

    await acceptPendingInvites(user.email, user._id.toString());

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    const userToReturn = user.toObject();
    delete (userToReturn as any).password;
    res.status(201).json({ success:true, data:{token, user: userToReturn}, });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};