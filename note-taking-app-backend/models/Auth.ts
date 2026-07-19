import mongoose from "mongoose";

export interface IAuth extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  savedNotes: mongoose.Types.ObjectId[];
  createdAt : Date;
  updateAt : Date;
}


const AuthSchema = new mongoose.Schema(
    {
        firstName : { type: String,
             required:true,minlength:2,maxlength:50},
        lastName : { type : String,
            required:true,minlength:2,maxlength:50},
        email : {type : String ,
             required:true,unique:true,
             lowercase:true,
             trim:true,
             maxlength:100},
        password : {type:String,required:true,min:5},
       savedNotes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Note",
        },
       ],
    },
    {timestamps:true}
);

const Auth = mongoose.model<IAuth>("Auth", AuthSchema);
export default Auth;