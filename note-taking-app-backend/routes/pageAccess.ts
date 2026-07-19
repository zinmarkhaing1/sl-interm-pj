import express from "express";
import PageAccess from "../models/PageAccess";
import {verifyToken} from "../middleware/auth";

const router = express.Router();


router.get("/", verifyToken, async(req:any,res)=>{

 try{

 const userId=req.user.id;

 const {pageUrl}=req.query;


 const access = await PageAccess.findOne({

   userId,

   pageUrl

 });


 res.json({
   access
 });


 }catch(err){

 res.status(500).json({
  message:"error"
 });

 }

});


export default router;