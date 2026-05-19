import mongoose from "mongoose";

export interface Note extends Document{
    title : string;
    content: string;
    description?: string;
    category:string;
    priority : string;
    assignee?: string;
    task?:string;
    startDate?: string;
    endDate?: string;
    user: mongoose.Types.ObjectId;

    createdAt : Date;
    updateAt : Date;
}

const NoteSchema =  new mongoose.Schema(
    {
        title : { type:String, required: true},
        content:{type:String,required:true},
        description:{type:String},
        category: {type:String,required:true},
        priority : {type:String,required:true},
        assignee: {type:String},
        task : {type:String,required:true},
        startDate: {type:String},
        endDate: {type:String},
        user: {type: mongoose.Schema.Types.ObjectId,ref: "Auth",required: true},
    },
    {timestamps:true}
);
const Note = mongoose.model<Note>("Note",NoteSchema);
export default Note;
