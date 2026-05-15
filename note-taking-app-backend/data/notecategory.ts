import mongoose from "mongoose";
const notetypesIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    
]



export const notetypes = [
    {
        _id:notetypesIds[0],
        name : "Todo"
    },
     {
        _id:notetypesIds[1],
        name : "Important"
    },
    
]
