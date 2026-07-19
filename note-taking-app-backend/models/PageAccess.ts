import mongoose, {Document, Types} from "mongoose";


export interface IPageAccess extends Document {

 userId: Types.ObjectId;

 ownerId: Types.ObjectId;

 pageType:
 | "category"
 | "board"
 | "note-form";

 pageUrl:string;

 permission:
 | "edit"
 | "comment"
 | "view";

 createdAt:Date;
 updatedAt:Date;

}


const PageAccessSchema = new mongoose.Schema({

 userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Auth",
  required:true
 },

 ownerId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Auth",
  required:true
 },

 pageType:{
  type:String,
  enum:[
    "category",
    "board",
    "note-form"
  ],
  required:true
 },

 pageUrl:{
  type:String,
  required:true
 },

 permission:{
  type:String,
  enum:[
    "edit",
    "comment",
    "view"
  ],
  default:"view"
 }

},
{
 timestamps:true
});


PageAccessSchema.index({
 userId:1,
 ownerId:1,
 pageUrl:1
},{
 unique:true
});


export default mongoose.model<IPageAccess>(
 "PageAccess",
 PageAccessSchema
);