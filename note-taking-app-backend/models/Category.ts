import mongoose from "mongoose";


export interface ICategory extends Document{
    name : string;
}
const CategorySchema = new mongoose.Schema(
    {
        name : {type:String,required:true,unique:true},
    },
    {timestamps:true}
);
const Category = mongoose.model<ICategory>("Category",CategorySchema);
export default Category;