import mongoose from "mongoose";

export interface Note extends Document{
    title : string;
    content: string;
    category:string;
    priority : string;
    user: mongoose.Types.ObjectId;

    createdAt : Date;
    updateAt : Date;
}

const NoteSchema =  new mongoose.Schema(
    {
        title : { type:String, required: true},
        content:{type:String,required:true},
        category: {type:String,required:true},
        priority : {type:String,required:true},
        user: {type: mongoose.Schema.Types.ObjectId,ref: "Auth",required: true},
    },
    {timestamps:true}
);
const Note = mongoose.model<Note>("Note",NoteSchema);
export default Note;
