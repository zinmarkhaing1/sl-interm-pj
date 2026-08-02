// import mongoose from "mongoose";


// export interface ICategory extends Document{
//     name : string;
//     createdAt : Date;
//   updateAt : Date;
// }
// const CategorySchema = new mongoose.Schema(
//     {
//         name : {type:String,required:true,unique:true},
//     },
//     {timestamps:true}
// );
// const Category = mongoose.model<ICategory>("Category",CategorySchema);
// export default Category;

// models/Category.ts
import mongoose from "mongoose";

export interface ICategory extends Document {
  name: string;
  projectId?: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;