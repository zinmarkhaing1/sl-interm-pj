import mongoose from "mongoose";
const priorityIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
]

const categoryIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
]

export const categories = [
    {
        _id:categoryIds[0],
        name : "Family  Friends"
    },
    {
        _id:categoryIds[1],
        name : "Fitness & Health"
    },
    {
        _id:categoryIds[2],
        name : "Study"
    },
    {
        _id:categoryIds[3],
        name : "My Note"
    },
    {
        _id:categoryIds[4],
        name : "Company Note"
    },
]
export const priority = [
    {
        _id:priorityIds[0],
        name : "Low"
    },
     {
        _id:priorityIds[1],
        name : "Medium"
    },
     {
        _id:priorityIds[2],
        name : "Heigh"
    },
]
